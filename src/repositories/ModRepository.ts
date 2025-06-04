import { IMod, ModModel } from "../database";

export async function isEmpty(): Promise<boolean> {
    return (await getAllMods()).length == 0;
}

export async function getAllMods(): Promise<IMod[]> {
    return await ModModel.find();
}

export async function hasMod(modID: string): Promise<boolean> {
    return findByModId(modID).then(mod => mod != null);
}

export async function createMod(mod: IMod): Promise<IMod> {
    return await ModModel.create(mod).catch(e => null);
}

export async function updateMod(modID: string, data: Partial<IMod>): Promise<boolean> {
    return (await ModModel.updateOne({ modID }, data)).modifiedCount > 0;
}

export async function findOrCreateByModId(modID: string): Promise<IMod> {
    return await ModModel.findOneAndUpdate(
        { modID },                      // search condition
        { $setOnInsert: { modID } },    // data to insert if not found
        { new: true, upsert: true }     // return the doc, insert if missing
    );
}

export async function findByModId(modID: string): Promise<IMod> {
    return await ModModel.findOne({ modID });
}

export async function deleteByModId(modID: string): Promise<boolean> {
    if (modID == null) return;
    return (await ModModel.deleteMany({ modID })).deletedCount > 0;
}

export async function getModWithUpdateCount(modID: string): Promise<IMod> {
    const results = await ModModel.aggregate([
        { $project: { __v: 0, _id: 0, }},       // hides _id and __v tags
        { $match: { modID } },
        { $replaceRoot: {
            newRoot: {
                mod: '$$ROOT'
            }
        } },
        { $lookup: {
            from: 'modupdates',
            localField: 'mod._id',
            foreignField: 'mod',
            as: 'updateCount'
        } },
        { $addFields: {
            updateCount: { $size: '$updateCount' }
        } },
        { $limit: 1 }
    ]);

    return results[0];
}

export async function getModsWithAllUpdates(): Promise<IMod[]> {
    const results = await ModModel.aggregate([
        { $lookup: {
            from: 'modupdates',
            localField: '_id',
            foreignField: 'mod',
            as: 'updates'
        } },
        { $project: {
            __v: 0,
            _id: 0,
            'updates._id': 0,
            'updates.__v': 0
        }},
    ]);

    return results;
}

export async function existsByModId(modID: string): Promise<boolean> {
    return await ModModel.findOne({ modID }) != null;
}
