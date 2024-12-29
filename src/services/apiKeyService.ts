import { v4 as UUIDv4 } from "uuid";
import { List, UUID } from "../types/java";
import { ApiKey } from "../types/dtos";

import { ApiKeyRepository } from "../repositories/ApiKeyRepository";
import { ApiKeyEntity } from "../types/entities";

export function getApiKeys(): List<ApiKey> {
    return ApiKeyRepository.findAll().map(apiKeyEntity => apiKeyEntity as ApiKey);
}

export function getApiKey(apiKey: UUID): ApiKey {
    return ApiKeyRepository.findById(apiKey) as ApiKey;
}

export function addApiKey(mods: string[]): ApiKey {
    return ApiKeyRepository.save(new ApiKeyEntity(UUIDv4(), mods)) as ApiKey;
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