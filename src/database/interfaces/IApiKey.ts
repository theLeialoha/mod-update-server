import { Types } from "mongoose";

export type IApiKey = {
    _id?: Types.ObjectId;
    apiKey: string;
    mods: string[];
}
