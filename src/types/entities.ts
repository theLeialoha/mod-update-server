
// Extra types

import { v4 as UUIDv4 } from 'uuid';
import { long, Optional, UUID } from './java';

type ReleaseType = 'beta' | 'alpha' | 'release';
type ModLoader = 'forge' | 'neoforge' | 'fabric' | 'quilt';

// entities

export class ApiKeyEntity {
    apiKey: UUID = UUIDv4();
    mods: string[] = [];

    readonly toString = () => JSON.stringify(this);
}

export class ModAndUpdate {
    mod: ModEntity = new ModEntity();
    update: UpdateEntity = new UpdateEntity();

    readonly toString = () => JSON.stringify(this);
}

export class ModAndUpdateCount {
    mod: ModEntity = new ModEntity();
    updateCount: number = 0;

    readonly toString = () => JSON.stringify(this);
}

export class ModEntity {
    modID: string = '-';
    name: string = '-';
    description: string = '-';
    websiteURL: string = '-';
    downloadURL: string = '-';
    issueURL: string = '-';

    readonly toString = () => JSON.stringify(this);
}

export class UpdateEntity {
    _id: long = -1; //UpdateRepository.counter++
    publishDate: string | Date = new Date();
    gameVersion: string = '-';
    version: string = '-';
    updateMessages: string[] = [];
    releaseType: ReleaseType = 'release';
    tags: string[] = [];
    modLoader: ModLoader = 'forge';
    mod: string = '-';

    readonly toString = () => JSON.stringify(this);
    get date(): Date {
        if (typeof this.publishDate == "string")
            return new Date(this.publishDate);
        return this.publishDate;
    }
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

export function createNullableInstance<T>(cls: Constructor<T>, fields: Optional<Partial<T>>): Optional<T> {
    if (fields == null) return null;
    return createInstance(cls, fields);
}


