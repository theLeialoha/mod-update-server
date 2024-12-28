import { ModRepository } from "../repositories/ModRepository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { Backup, ModWithUpdates, UpdateWithoutIdAndMod } from "../types/dtos";
import { ModEntity, UpdateEntity } from "../types/entities";
import { List } from "../types/java";

function getBackup(): Backup {
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
function restore(backup: Backup): boolean {
    if (ModRepository.count() > 0 || UpdateRepository.count() > 0) {
        return false;
    }

    for (const mod of backup.mods) {
        const modEntity: ModEntity = ModRepository.save(new ModEntity(mod));
        ModRepository.save(modEntity);
        for (const update of mod.updates) {
            var updateEntity: UpdateEntity = new UpdateEntity(update);
            updateEntity.mod = modEntity.modID;
            UpdateRepository.save(updateEntity);
        }
    }

    return true;
}