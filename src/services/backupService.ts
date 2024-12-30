import { ModRepository } from "../repositories/ModRepository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { Backup, ModWithUpdates, UpdateWithoutIdAndMod } from "../types/dtos";
import { ModEntity, UpdateEntity, createInstance } from "../types/entities";
import { List } from "../types/java";

export function getBackup(): Backup {
    var mods: List<ModWithUpdates> = [];
    for (const mod of ModRepository.findAll()) {
        const modWithUpdates: ModWithUpdates = mod as any as ModWithUpdates;
        modWithUpdates.updates = UpdateRepository.getAllByMod(mod.modID) as any as List<UpdateWithoutIdAndMod>;
        mods.push(modWithUpdates);
    }
    return { backupDate: new Date(), mods };
}

/**
 * @param backup the backup
 * @return <code>false</code> if the database is not empty
 */
export function restore(backup: Backup): boolean {
    if (ModRepository.count() > 0 || UpdateRepository.count() > 0) {
        return false;
    }

    for (const mod of backup.mods) {
        const modEntity = ModRepository.insertOne(createInstance(ModEntity, mod));
        for (const update of mod.updates) {
            Object.defineProperty(update, "mod", { value: modEntity.modID });
            UpdateRepository.insertOne(createInstance(UpdateEntity, update));
        }
    }

    return true;
}