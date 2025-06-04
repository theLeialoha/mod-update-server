import { Types } from "mongoose";
import { IModUpdate } from "./IModUpdate";


export type IMod = {
    _id?: Types.ObjectId;
    modID: string;
    name: string;
    description?: string;
    websiteURL?: string;
    downloadURL?: string;
    issueURL?: string;

    updates?: IModUpdate[];
    updateCount?: number;
}
