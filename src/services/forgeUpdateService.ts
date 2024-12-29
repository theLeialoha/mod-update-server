import { ModRepository } from "../repositories/ModRepository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { ModEntity, UpdateEntity } from "../types/entities";
import { HashMap, List, Optional } from "../types/java";

export function modUpdatesForLoader(loader: string, modID: string): HashMap<string, any> {
    const optionalMod: Optional<ModEntity> = ModRepository.findById(modID);
    if (optionalMod == null) return {};

    // Counter.builder("requests.update_check.cache_miss").tag("loader", loader).tag("modID", modID).register(meterRegistry).increment();

    const mod: ModEntity = optionalMod;

    const forgeFormat: HashMap<string, any> = {};
    const promos: HashMap<string, string> = {};

    const latest: List<UpdateEntity> = UpdateRepository.getLatestUpdateEntries(mod.modID, loader);
    const recommended: List<UpdateEntity> = UpdateRepository.getRecommendedUpdateEntries(mod.modID, loader);

    for (const entity of latest) {
        const o: HashMap<string, string> = forgeFormat[entity.gameVersion] || {};
        o[entity.version] = entity.updateMessages.join("\n");
        promos[`${entity.gameVersion}-latest`] = entity.version;
    }

    for (const entity of recommended) {
        const o: HashMap<string, string> = forgeFormat[entity.gameVersion] || {};
        o[entity.version] = entity.updateMessages.join("\n");
        promos[`${entity.gameVersion}-recommended`] = entity.version;
    }

    forgeFormat["promos"] = promos;
    forgeFormat["homepage"] = mod.websiteURL;
    return forgeFormat;
}
