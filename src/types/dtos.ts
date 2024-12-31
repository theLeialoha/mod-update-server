
// Extra types

import { HashMap, List, long, UUID, int } from "./java";

type ReleaseType = "beta" | "alpha" | "release";
type ModLoader = "forge" | "neoforge" | "fabric" | "quilt";


// dtos

export type ApiKey = {
    apiKey: UUID,
    mods: string[],
}

export type Backup = {
    backupDate: string | Date,
    mods: List<ModWithUpdates>,
}

export type Error = {
    statusCode: int;
    message: string;
}

export type Mod = {
    modID: string;
}

export type ModWithUpdates = Mod & {
    updates: List<UpdateWithoutIdAndMod>;
}

export type ModWithoutModId = {
    name: string;
    description: string;
    websiteURL: string;
    downloadURL: string;
    issueURL: string;
}

export type ModWithUpdateCount = Mod & {
    updateCount: number;
}

export type Update = UpdateWithoutIdAndMod & {
    _id: long,
    mod: string,
}

export type UpdateCheckResponse = {

    homepage: string;
    versions: HashMap<string, VersionUpdateInfo>;
}

export type VersionUpdateInfo = {
    latest: Version;
    recommended: Version;
}

export type Version = {
    version: string;
    changelog: string[];
    downloadLinks: string[];
}

export type UpdateWithMod = UpdateWithoutIdAndMod & {
    _id: long;
    mod: Mod;
}

export type UpdateWithoutId = UpdateWithoutIdAndMod & {
    mod: string;
}

export type UpdateWithoutIdAndMod = {
    publishDate: string | Date;
    gameVersion: string;
    version: string;
    updateMessages: string[];
    releaseType: ReleaseType;
    tags: string[];
    modLoader: ModLoader;
}

export type ApiKeys = ApiKey[];
