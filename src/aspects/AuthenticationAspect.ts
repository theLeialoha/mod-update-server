import * as validateUUID from "uuid-validate";
import { HashMap, Optional, UUID } from "../types/java";

import { Request } from "express";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { getApiKey } from "../repositories/ApiKeyRepository";
import { IApiKey } from "../database";

// Make sure we only get the key (if it's a single value)
function getApiKeyFromHeader(req: Request): UUID {
    return req.headers["apikey"] ?
        !Array.isArray(req.headers["apikey"]) ?
            req.headers["apikey"] : null : null;
}

export async function validateHeaders(req: Request): Promise<void> {
    const allowBody = req.originalUrl.startsWith("/mods/add");
    const attributes: HashMap<string, any> = req.params;
    const body: HashMap<string, any> = allowBody ? req.body : {};
    const modID: string = body["modID"] || attributes["modId"] || "*";

    if (!await hasPermission(getApiKeyFromHeader(req), modID))
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Insufficient permissions");
}

function validMasterKey(apikey: UUID): boolean {
    const masterKey = getMasterKey();

    return masterKey 
        && validateUUID(apikey)
        && apikey == masterKey;
}

export async function validateHeadersMaster(req: Request): Promise<void> {
    const apikey: UUID = parseApiKey(getApiKeyFromHeader(req));
    if (!validMasterKey(apikey)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Insufficient permissions");
}

export async function hasPermission(key: UUID, modID: string): Promise<boolean> {
    const uuid: UUID = parseApiKey(key);
    if (validMasterKey(uuid)) return true;

    const apikey: IApiKey = await getApiKey(uuid);
    if (apikey == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key");
    
    const modList: string[] = apikey.mods as string[];
    return modList.includes('*') || modList.includes(modID);
}

function getMasterKey(): UUID {
    const apiKey = process.env.MASTER_KEY;
    if (!apiKey || !validateUUID(apiKey)) return null;
    return apiKey;
}

function parseApiKey(apiKey: string): UUID {
    if (apiKey == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No API key provided");
    if (!validateUUID(apiKey)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key");
    return apiKey;
}

