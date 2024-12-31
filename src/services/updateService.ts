import { ModRepository } from "../repositories/ModRepository";
import { Pageable } from "../repositories/Repository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { Mod, Update, UpdateWithMod, UpdateWithoutId, UpdateWithoutIdAndMod } from "../types/dtos";
import { ModAndUpdate, ModEntity, UpdateEntity, createInstance } from "../types/entities";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { List, Optional, int, long } from "../types/java";

export function getUpdates(amount: int, page: int): List<UpdateWithMod> {
    const p: List<ModAndUpdate> = UpdateRepository.getAllUpdatesWithMod(Pageable.of(page, amount));
    return p.map(e => {
        const updateWithMod: UpdateWithMod = e.update as any as UpdateWithMod;
        updateWithMod.mod = e.mod as Mod;
        return updateWithMod;
    });
}

/**
 * @param modID  the mod id
 * @param amount the amount per page
 * @param page   the page
 * @return <code>null</code> if the mod does not exist
 */
export function getModUpdates(modID: string, amount: int, page: int): Optional<List<Update>> {
    const optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) return null;
    const mod: ModEntity = optionalMod;

    const p: List<UpdateEntity> = UpdateRepository.findAllByModOrderByPublishDateDesc(mod.modID, Pageable.of(page, amount));
    return p.map(updateEntity => updateEntity as Update);
}

/**
 * @param modID  the mod ID
 * @param update the update
 * @return <code>false</code> if the mod does not exist
 */
export function addUpdate(modID: string, update: UpdateWithoutIdAndMod): boolean {
    const optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) return false;
    const mod: ModEntity = optionalMod;
    const createdUpdate: UpdateWithoutId = update as UpdateWithoutId;
    createdUpdate.mod = mod.modID;
    UpdateRepository.insertOne(createInstance(UpdateEntity, createdUpdate));
    return true;
}


/**
 * @param modID    the mod ID
 * @param updateID the update ID
 * @return the update
 * @throws {Error} if the mod or update doesn't exist
 */
export function getUpdate(modID: string, updateID: long): Update {
    const optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");

    const mod: ModEntity = optionalMod;
    const optionalUpdate: Optional<UpdateEntity> = UpdateRepository.findFirstByModAndId(mod.modID, updateID);
    if (optionalUpdate == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Update does not exist");

    return optionalUpdate as any as Update;
}

/**
 * @param modID    the mod ID
 * @param updateID the update ID
 * @param update   the update
 * @throws {Error} if the mod or update doesn't exist
 */
export function editUpdate(modID: string, updateID: long, update: UpdateWithoutIdAndMod): void {
    const optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");

    const mod: ModEntity = optionalMod;
    const optionalUpdate: Optional<UpdateEntity> = UpdateRepository.findFirstByModAndId(mod.modID, updateID);

    if (optionalUpdate == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Update does not exist");
    const updateEntity: UpdateEntity = optionalUpdate;

    updateEntity.publishDate = update.publishDate;
    updateEntity.gameVersion = update.gameVersion;
    updateEntity.version = update.version;
    updateEntity.updateMessages = update.updateMessages;
    updateEntity.releaseType = update.releaseType;
    updateEntity.tags = update.tags;
    updateEntity.modLoader = update.modLoader;
    UpdateRepository.updateById((updateEntity as any)._id, updateEntity);
}

/**
 * @param modID    the mod ID
 * @param updateID the update ID
 * @throws {Error} if the mod or update doesn't exist
 */
export function deleteUpdate(modID: string, updateID: long): void {
    const optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");

    const mod: ModEntity = optionalMod;
    const optionalUpdate: Optional<UpdateEntity> = UpdateRepository.findFirstByModAndId(mod.modID, updateID);
    if (optionalUpdate == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Update does not exist");

    UpdateRepository.deleteById((optionalUpdate as any)._id);
}