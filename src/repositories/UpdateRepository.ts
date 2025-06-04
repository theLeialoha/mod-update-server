import { IModUpdate, ModUpdateModel } from "../database";
import { findOrCreateByModId } from "./ModRepository";
import { Pageable } from "./Repository";

export async function isEmpty(): Promise<boolean> {
    const updates = await ModUpdateModel.find();
    return updates.length == 0;
}

export async function createUpdate(update: IModUpdate): Promise<IModUpdate> {
    return await ModUpdateModel.create( update ).catch(e => null);
}

export async function createUpdateWithId(modID: string, update: IModUpdate): Promise<IModUpdate> {
    update.mod = (await findOrCreateByModId(modID))._id;
    return await ModUpdateModel.create( update ).catch(e => null);
}

export async function editUpdate(modId: string, id: number, data: Partial<IModUpdate>): Promise<boolean> {
    const update = await findUpdateByModAndId(modId, id);
    if (update == null) return false;
    return (await ModUpdateModel.findByIdAndUpdate(update._id, data)) != null;
}

export async function deleteUpdate(modId: string, id: number) {
    const update = await findUpdateByModAndId(modId, id);
    if (update == null) return false;
    return (await ModUpdateModel.deleteOne({ _id: update._id })).deletedCount > 0;
}

export async function getModUpdates(modId: string, pageable: Pageable): Promise<IModUpdate[]> {
    const { page, amount: limit} = pageable;

    return await ModUpdateModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $sort: { id: -1 } },                  // sort by latest
        { $lookup: {
            from: 'mods',                       // model
            localField: 'mod',                  // field (within ModUpdateModel)
            foreignField: '_id',                // field (within ModModel)
            as: 'mod'                           // save as
        } },
        { $unwind: '$mod' },                    // pulls into output
        { $addFields: { mod: '$mod.modID' } },  // makes the mod (within ModUpdateModel) the modID
        { $match: { mod: modId } },             // filters out based on modID
        { $skip: limit * page },                // skip x pages
        { $limit: limit },                      // limit to x per page
    ]);
}

export async function findUpdateByModAndId(modId: string, id: number): Promise<IModUpdate> {
    const results = await ModUpdateModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $lookup: {
            from: 'mods',                       // model
            localField: 'mod',                  // field (within ModUpdateModel)
            foreignField: '_id',                // field (within ModModel)
            as: 'mod'                           // save as
        } },
        { $unwind: '$mod' },                    // pulls into output
        { $match: { 
            'mod.modID': modId,                 // filters out based on modID
            id: id                              // filters out based on update id
         } },
        { $addFields: { mod: '$mod.modID' } },  // makes the mod (within ModUpdateModel) the modID
        { $limit: 1 },                          // limit to 1
    ])
    
    return results[0];
}

export async function getAllUpdatesWithMod(pageable: Pageable): Promise<IModUpdate[]> {
    const { page, amount: limit} = pageable;

    return await ModUpdateModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $lookup: {
            from: 'mods',                       // model
            localField: 'mod',                  // field (within ModUpdateModel)
            foreignField: '_id',                // field (within ModModel)
            as: 'mod'                           // save as
        } },
        { $skip: limit * page },                // skip x pages
        { $limit: limit },                      // limit to x per page
        { $project: { 
            'mod._id': 0,                       // hides mod _id tag
            'mod.__v': 0,                       // hides mod __v tag
        }},
    ]);
}

export async function getAllByMod(modId: string): Promise<IModUpdate[]> {
    return await ModUpdateModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $lookup: {
            from: 'mods',                       // model
            localField: 'mod',                  // field (within ModUpdateModel)
            foreignField: '_id',                // field (within ModModel)
            as: 'mod'                           // save as
        } },
        { $unwind: '$mod' },                    // pulls into output
        { $match: { 'mod.modID': modId } },     // filters out based on modID
        { $addFields: { mod: '$mod.modID' } },  // makes the mod (within ModUpdateModel) the modID
    ]);
}

export async function removeAllByMod(modId: string) {
    const updateIds = await getAllByMod(modId).then(updates => updates.map(u => u._id));
    return (await ModUpdateModel.deleteMany({ _id: { $in: updateIds } })).deletedCount > 0;
}

export async function getLatestUpdateEntries(modId: string, loader: string): Promise<IModUpdate[]> {
    return await ModUpdateModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $sort: { id: -1 } },                  // sort by latest
        { $lookup: {
            from: 'mods',                       // model
            localField: 'mod',                  // field (within ModUpdateModel)
            foreignField: '_id',                // field (within ModModel)
            as: 'mod'                           // save as
        } },
        { $unwind: '$mod' },                    // pulls into output
        { $match: { $and: [
            { 'mod.modID': modId },             // filters out based on modID
            { modLoader: loader },              // filters out based on loader
        ] } },
        { $addFields: { mod: '$mod.modID' } },  // makes the mod (within ModUpdateModel) the modID
        { $group: {
            _id: '$gameVersion',
            doc: { $first: '$$ROOT' }           // keeps the first document per group
        } },
        { $replaceRoot: { newRoot: '$doc' } },  // flatten the grouped document
    ]);
}

export async function getRecommendedUpdateEntries(modId: string, loader: string): Promise<IModUpdate[]> {
    return await ModUpdateModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $lookup: {
            from: 'mods',                       // model
            localField: 'mod',                  // field (within ModUpdateModel)
            foreignField: '_id',                // field (within ModModel)
            as: 'mod'                           // save as
        } },
        { $unwind: '$mod' },                    // pulls into output
        { $match: { $and: [
            { 'mod.modID': modId },             // filters out based on modID
            { modLoader: loader },              // filters out based on loader
        ] } },
        { $addFields: {
            mod: '$mod.modID',                  // makes the mod (within ModUpdateModel) the modID
            recommend: { 
                $in: ['recommended', '$tags']   // adds a recommend bool if recommended
            },
        } },
        { $sort: { recommend: -1, id: -1 } },   // sort by recommended then latest
        { $group: {
            _id: '$gameVersion',
            doc: { $first: '$$ROOT' }           // keeps the first document per group
        } },
        { $replaceRoot: { newRoot: '$doc' } },  // flatten the grouped document
    ]);
}

