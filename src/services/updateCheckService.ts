import { ModRepository } from "../repositories/ModRepository";
import { UpdateRepository } from "../repositories/UpdateRepository";
import { UpdateCheckResponse, VersionUpdateInfo } from "../types/dtos";
import { ModEntity, UpdateEntity } from "../types/entities";
import { List, Optional } from "../types/java";

export function modUpdatesForLoader(loader: string, modID: string): UpdateCheckResponse {
    var optionalMod: Optional<ModEntity> = ModRepository.findByModId(modID);
    if (optionalMod == null) throw new Error("Mod does not exist");

    // Counter.builder("requests.update_check.cache_miss").tag("loader", loader).tag("modID", modID).register(meterRegistry).increment();

    var mod: ModEntity = optionalMod;

    var response: UpdateCheckResponse = {
        homepage: mod.websiteURL,
        versions: {}
    };

    var latest: List<UpdateEntity> = UpdateRepository.getLatestUpdateEntries(mod.modID, loader);
    var recommended: List<UpdateEntity> = UpdateRepository.getRecommendedUpdateEntries(mod.modID, loader);

    for (const entry of latest) {
        var versionUpdateInfo: VersionUpdateInfo = {
            latest: { version: entry.version, changelog: entry.updateMessages, downloadLinks: [] },
            recommended: { version: '', changelog: [], downloadLinks: [] }
        };
        response.versions[entry.gameVersion] = versionUpdateInfo;
    }

    for (const entry of recommended) {
        var info: VersionUpdateInfo = response.versions[entry.gameVersion];
        if (info == null) continue;
        info.recommended = { version: entry.version, changelog: entry.updateMessages, downloadLinks: [] };
    }

    return response;
}