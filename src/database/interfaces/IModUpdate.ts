import { Types } from "mongoose";
import { IMod } from ".";

export type IModUpdate = {
    _id?: Types.ObjectId;
    id: number;
    publishDate: Date;
    gameVersion: string;
    version: string;
    updateMessages: string[];
    releaseType: string;
    modLoader: string;
    mod: IMod["_id"] | IMod["modID"];
    tags: string[];
}
