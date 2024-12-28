
// Extra types

import { UpdateRepository } from '../repositories/UpdateRepository';
import { ModWithUpdates, UpdateWithoutIdAndMod } from './dtos';
import { long, UUID } from './java';

type ReleaseType = 'beta' | 'alpha' | 'release';
type ModLoader = 'forge' | 'neoforge' | 'fabric' | 'quilt';

// entities

export class ApiKeyEntity {
    apiKey: UUID;
    mods: string[];

    constructor(...args: any) {
        this.apiKey = args[0] as UUID;
        this.mods = args[1] as string[];
    }
}

export class ModAndUpdate {
    mod: ModEntity;
    update: UpdateEntity;
}

export class ModAndUpdateCount {
    mod: ModEntity;
    updateCount: number;
}

export class ModEntity {
    modID: string;
    name: string;
    description: string;
    websiteURL: string;
    downloadURL: string;
    issueURL: string;

    constructor(arg: any) {
        this.modID = arg.mod || arg.modID;
        this.name = '-';
        this.description = '-';
        this.websiteURL = '-';
        this.downloadURL = '-';
        this.issueURL = '-';

        if (this.modID == null) throw new Error('Mod ID is required');
    }
}

export class UpdateEntity {
    id: long;
    publishDate: Date;
    gameVersion: string;
    version: string;
    updateMessages: string[];
    releaseType: ReleaseType;
    tags: string[];
    modLoader: ModLoader;
    mod: string;

    constructor(arg: any) {
        this.id = arg.id || UpdateRepository.counter++;
        this.publishDate = arg.publishDate || new Date();
        this.gameVersion = arg.gameVersion || '-';
        this.version = arg.version || '-';
        this.updateMessages = arg.updateMessages || [];
        this.releaseType = arg.releaseType || 'forge';
        this.tags = arg.tags || [];
        this.modLoader = arg.modLoader || '-';
        this.mod = arg.mod || '-';
    }
}
