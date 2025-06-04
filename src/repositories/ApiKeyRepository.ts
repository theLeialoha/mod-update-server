import { ApiKeyModel, IApiKey } from "../database";
import { UUID } from "../types/java";


export async function getApiKeys(): Promise<IApiKey[]> {
    return await ApiKeyModel.find();
}

export async function getApiKey(apiKey: UUID): Promise<IApiKey> {
    return await ApiKeyModel.findOne({ apiKey });
}

export async function addApiKey(mods: string[]): Promise<IApiKey> {
    return await ApiKeyModel.create({ mods });
}

export async function removeApiKey(apiKey: UUID): Promise<boolean> {
    if (apiKey == null) return false;
    return (await ApiKeyModel.deleteOne({ apiKey })).deletedCount > 0;
}
