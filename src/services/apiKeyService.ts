import { v4 as UUIDv4 } from "uuid";
import { List, UUID } from "../types/java";
import { ApiKey } from "../types/dtos";

import { ApiKeyRepository } from "../repositories/ApiKeyRepository";
import { ApiKeyEntity } from "../types/entities";

function getApikeys(): List<ApiKey> {
    return ApiKeyRepository.findAll().map(apiKeyEntity => apiKeyEntity as ApiKey);
}

function getApikey(apiKey: UUID): ApiKey {
    return ApiKeyRepository.findById(apiKey) as ApiKey;
}

function addApikey(mods: string[]): ApiKey {
    return ApiKeyRepository.save(new ApiKeyEntity(UUIDv4(), mods)) as ApiKey;
}

/**
 * @param apikey the API key to remove
 * @return if the API key was found and deleted
 */
function removeApikey(apikey: UUID): boolean {
    if (!ApiKeyRepository.existsById(apikey)) return false;
    ApiKeyRepository.deleteById(apikey);
    return true;
}