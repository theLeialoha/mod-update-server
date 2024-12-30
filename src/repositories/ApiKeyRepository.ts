import { ApiKeyEntity } from "../types/entities";
import { UUID } from "../types/java";
import { ManagedRepository } from "./Repository";

export const ApiKeyRepository = new ManagedRepository<any>("apiKey");