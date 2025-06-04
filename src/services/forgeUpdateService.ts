import { IMod, IModUpdate } from "../database";
import { findByModId } from "../repositories/ModRepository";
import { getLatestUpdateEntries, getRecommendedUpdateEntries } from "../repositories/UpdateRepository";
import { HashMap } from "../types/java";

export async function modUpdatesForLoader(loader: string, modID: string) {
    const mod: IMod = await findByModId(modID);
    if (mod == null) return {};

    const forgeFormat: HashMap<string, any> = {};
    const promos: HashMap<string, string> = {};

    const latest: IModUpdate[] = await getLatestUpdateEntries(modID, loader);
    const recommended: IModUpdate[] = await getRecommendedUpdateEntries(modID, loader);

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

    forgeFormat.promos = promos;
    forgeFormat.homepage = mod.websiteURL;
    return forgeFormat;
}
