
// Extra types

import { v4 as UUIDv4 } from 'uuid';
import { long, UUID } from './java';

type ReleaseType = 'beta' | 'alpha' | 'release';
type ModLoader = 'forge' | 'neoforge' | 'fabric' | 'quilt';

// entities

export class ApiKeyEntity {
    apiKey: UUID = UUIDv4();
    mods: string[] = [];
}

export class ModAndUpdate {
    mod: ModEntity = new ModEntity();
    update: UpdateEntity = new UpdateEntity();
}

export class ModAndUpdateCount {
    mod: ModEntity = new ModEntity();
    updateCount: number = 0;
}

export class ModEntity {
    modID: string = '-';
    name: string = '-';
    description: string = '-';
    websiteURL: string = '-';
    downloadURL: string = '-';
    issueURL: string = '-';
}

export class UpdateEntity {
    id: long = -1; //UpdateRepository.counter++
    publishDate: Date = new Date();
    gameVersion: string = '-';
    version: string = '-';
    updateMessages: string[] = [];
    releaseType: ReleaseType = 'release';
    tags: string[] = [];
    modLoader: ModLoader = 'forge';
    mod: string = '-';
}


type Constructor<T> = new (...args: any[]) => T;

export function createInstance<T>(cls: Constructor<T>, fields: Partial<T>): T {
    const instance = new cls();

    for (const key in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            const typedKey = key as keyof T;
            const value = fields[typedKey];

            // Ensure runtime type safety
            if (value !== undefined) {
                instance[typedKey] = value as T[typeof typedKey];
            }
        }
    }

    return instance;
}


