import * as validateUUID from "uuid-validate";
import { HashMap, Optional, UUID } from "../types/java";
import { ApiKey } from "../types/dtos";

import * as ApiKeyService from "../services/apiKeyService";
import { Request } from "express";
import { HttpStatus, ResponseStatusException } from "../types/errors";

// Make sure we only get the key (if it's a single value)
function getApiKey(req: Request): Optional<UUID> {
    return req.headers["apikey"] ?
        !Array.isArray(req.headers["apikey"]) ?
            req.headers["apikey"] : null : null;
}

export function validateHeaders(req: Request): void {
    const allowBody = req.baseUrl == "/mods/add";
    const attributes: HashMap<string, any> = req.params;
    const body: HashMap<string, any> = allowBody ? req.body : {};
    const modID: string = attributes["modId"] || body["modID"] || "*";

    if (!hasPermission(getApiKey(req), modID))
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Insufficient permissions");
}

function validMasterKey(apikey: UUID): boolean {
    if (getMasterKey() == null) return false;
    return apikey == getMasterKey()
        && validateUUID(getMasterKey() as string);
}

export function validateHeadersMaster(req: Request): void {
    const apikey: UUID = parseApiKey(getApiKey(req));
    if (!validMasterKey(apikey)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Insufficient permissions");
}

export function hasPermission(key: Optional<UUID>, modID: string): boolean {
    const uuid: UUID = parseApiKey(key);
    if (validMasterKey(uuid)) return true;

    const apikey: Optional<ApiKey> = ApiKeyService.getApiKey(uuid);
    if (apikey == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key");

    const apiKey: ApiKey = apikey;
    return apiKey.mods.reduce((success, s) => ['*', modID].includes(s) || success, false);
}

function getMasterKey(): Optional<UUID> {
    const apiKey = process.env.MASTER_KEY;
    if (!apiKey || !validateUUID(apiKey)) return null;
    return apiKey;
}

function parseApiKey(apiKey: Optional<string>): UUID {
    if (apiKey == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No API key provided");
    if (!validateUUID(apiKey)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key");
    return apiKey;
}

