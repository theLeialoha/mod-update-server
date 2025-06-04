import { IMod, IModUpdate } from "../database";
import { findByModId } from "../repositories/ModRepository";
import { getLatestUpdateEntries, getRecommendedUpdateEntries } from "../repositories/UpdateRepository";
import { UpdateCheckResponse, VersionUpdateInfo } from "../types/dtos";
import { HttpStatus, ResponseStatusException } from "../types/errors";

export async function modUpdatesForLoader(loader: string, modID: string): Promise<UpdateCheckResponse> {

    const mod: IMod = await findByModId(modID);
    if (mod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");

    var response: UpdateCheckResponse = {
        homepage: mod.websiteURL,
        versions: {}
    };

    var latest: IModUpdate[] = await getLatestUpdateEntries(mod.modID, loader);
    var recommended: IModUpdate[] = await getRecommendedUpdateEntries(mod.modID, loader);
    
    for (const entry of latest) {
        var versionUpdateInfo: VersionUpdateInfo = {
            latest: { version: entry.version, changelog: entry.updateMessages, downloadLinks: [] },
            recommended: { version: entry.version, changelog: entry.updateMessages, downloadLinks: [] }
        };
        response.versions[entry.gameVersion] = versionUpdateInfo;
    }

    for (const entry of recommended) {
        var info: VersionUpdateInfo = response.versions[entry.gameVersion];
        info.recommended = { version: entry.version, changelog: entry.updateMessages, downloadLinks: [] };
    }

    return response;
}