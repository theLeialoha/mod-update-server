import validateUUID from "uuid-validate";
import { HashMap, Optional, UUID } from "../types/java";
import { ApiKey } from "../types/dtos";

import * as ApiKeyService from "../services/apiKeyService";
import { Request } from "express";

// Make sure we only get the key (if it's a single value)
function getApiKey(req: Request): Optional<UUID> {
    return req.headers["apikey"] ?
        !Array.isArray(req.headers["apikey"]) ?
            req.headers["apikey"] : null : null;
}

export function validateHeaders(req: Request): void {
    const attributes: HashMap<string, any> = req.params;
    const modID: string = attributes["modID"] || "*";
    
    if (!hasPermission(getApiKey(req), modID))
        throw new Error("Insufficient permissions");
}

export function validateHeadersMaster(req: Request): void {
    const apikey: UUID = parseApiKey(getApiKey(req));
    if (apikey != getMasterKey())  throw new Error("Insufficient permissions");

}

export function hasPermission(key: Optional<string>, modID: string): boolean {
    const uuid: UUID = parseApiKey(key);
    if (uuid == getMasterKey()) return true;

    const apikey: Optional<ApiKey> = ApiKeyService.getApiKey(uuid);
    if (apikey == null) throw new Error("Invalid API key");

    const apiKey: ApiKey = apikey;
    return apiKey.mods.reduce((success, s) => ['*', modID].includes(s) || success, false);
}

function getMasterKey(): Optional<UUID> {
    const apiKey = process.env["MASTER_KEY"];
    if (!apiKey || !validateUUID(apiKey)) return null;
    return apiKey;
}

function parseApiKey(apiKey: Optional<string>): UUID {
    if (apiKey == null) throw new Error("No API key provided");
    if (!validateUUID(apiKey)) throw new Error("Invalid API key");
    return apiKey;
}

