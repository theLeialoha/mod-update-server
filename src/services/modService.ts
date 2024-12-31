import { ModRepository } from "../repositories/ModRepository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { Mod, ModWithUpdateCount, ModWithoutModId } from "../types/dtos";
import { ModEntity, createInstance } from "../types/entities";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { List, Optional } from "../types/java";


export function doesModExist(modId: string): boolean {
    return ModRepository.findByModId(modId) != null;
}

export function getMods(): List<Mod> {
    return ModRepository.findAll().map(modEntity => modEntity as Mod);
}

/**
 * @param mod the mod
 * @return <code>false</code> if the mod already exists
 */
export function addMod(mod: Mod): boolean  {
    if (doesModExist(mod.modID)) return false;
    ModRepository.insertOne(createInstance(ModEntity, mod));
    return true;
}

/**
 * @param modID the mod ID
 * @param mod   the mod
 * @return <code>false</code> if the mod does not exist
 */
export function editMod(modID: string, mod: ModWithoutModId): boolean {
    var optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) return false;
    var modToUpdate: ModEntity = optionalMod;

    modToUpdate.name = mod.name;
    modToUpdate.description = mod.description;
    modToUpdate.websiteURL = mod.websiteURL;
    modToUpdate.downloadURL = mod.downloadURL;
    modToUpdate.issueURL = mod.issueURL;

    ModRepository.updateById((optionalMod as any)._id, modToUpdate);
    return true;
}

export function getMod(modID: string): Optional<ModWithUpdateCount> {
    return ModRepository.getModWithUpdateCount(modID) as Optional<ModWithUpdateCount>;
}

/**
 * @param modID the mod ID
 * @throws {Error} if the mod or update doesn't exist or the update couldn't get deleted
 */
export function deleteMod(modID: string): void {
    var optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");

    var mod: ModEntity = optionalMod;

    UpdateRepository.removeAllByMod(mod.modID);
    ModRepository.deleteByModId(mod.modID);
}