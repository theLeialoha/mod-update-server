import { ModRepository } from "../repositories/ModRepository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { Mod, ModWithUpdateCount, ModWithoutModId } from "../types/dtos";
import { ModEntity } from "../types/entities";
import { List, Optional } from "../types/java";


function doesModExist(modId: string): boolean {
    return ModRepository.findById(modId) != null;
}

function getMods(): List<Mod> {
    return ModRepository.findAll().map(modEntity => modEntity as Mod);
}

/**
 * @param mod the mod
 * @return <code>false</code> if the mod already exists
 */
function addMod(mod: Mod): boolean  {
    if (doesModExist(mod.modID)) return false;
    ModRepository.save(mod as ModEntity);
    return true;
}

/**
 * @param modID the mod ID
 * @param mod   the mod
 * @return <code>false</code> if the mod does not exist
 */
function editMod(modID: string, mod: ModWithoutModId): boolean {
    var optionalMod: Optional<ModEntity> = ModRepository.findById(modID);
    if (optionalMod == null) return false;
    var modToUpdate: ModEntity = optionalMod;

    modToUpdate.name = mod.name;
    modToUpdate.description = mod.description;
    modToUpdate.websiteURL = mod.websiteURL;
    modToUpdate.downloadURL = mod.downloadURL;
    modToUpdate.issueURL = mod.issueURL;

    ModRepository.save(modToUpdate);
    return true;
}

function getMod(modID: string): Optional<ModWithUpdateCount> {
    return ModRepository.getModWithUpdateCount(modID) as Optional<ModWithUpdateCount>;
}

/**
 * @param modID the mod ID
 * @throws {Error} if the mod or update doesn't exist or the update couldn't get deleted
 */
function deleteMod(modID: string): void {
    var optionalMod: Optional<ModEntity> = ModRepository.findById(modID);
    if (optionalMod == null) throw new Error("Mod does not exist");

    var mod: ModEntity = optionalMod;

    UpdateRepository.removeAllByMod(mod.modID);
    ModRepository.deleteById(mod.modID);
}