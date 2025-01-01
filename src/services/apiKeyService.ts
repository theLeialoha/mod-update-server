import { List, UUID } from "../types/java";
import { ApiKey } from "../types/dtos";

import { ApiKeyRepository } from "../repositories/ApiKeyRepository";
import { ApiKeyEntity, createInstance } from "../types/entities";
import { HttpStatus, ResponseStatusException } from "../types/errors";

export function getApiKeys(): List<ApiKey> {
    return ApiKeyRepository.findAll().map(apiKeyEntity => apiKeyEntity as ApiKey);
}

export function getApiKey(apiKey: UUID): ApiKey {
    return ApiKeyRepository.findById(apiKey) as ApiKey;
}

export function addApiKey(mods: string[]): ApiKey {
    if (mods == undefined || !Array.isArray(mods)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body should be a list of mods as strings");
    if (mods.find(v => typeof v != "string")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body should be a list of mods as strings");
    return ApiKeyRepository.insertOne(createInstance(ApiKeyEntity, { mods })) as ApiKey;
}

/**
 * @param apikey the API key to remove
 * @return if the API key was found and deleted
 */
export function removeApiKey(apikey: UUID): boolean {
    if (!ApiKeyRepository.existsById(apikey)) return false;
    ApiKeyRepository.deleteById(apikey);
    return true;
}