import { ApiKeyEntity } from "../types/entities";
import { UUID } from "../types/java";
import { Repository } from "./Repository";

export const ApiKeyRepository = new Repository<ApiKeyEntity, UUID>();