import { Request, Response, Router } from "express";
import asyncHandler = require("express-async-handler");
const ROUTER = Router();

import { validateMasterApiKey } from "./middleware/apiKey";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { createMod, getModsWithAllUpdates, isEmpty as isModsEmpty, updateMod } from "../repositories/ModRepository";
import { createUpdate, isEmpty as isUpdatesEmpty } from "../repositories/UpdateRepository";
import { IMod } from "../database";


ROUTER.get('/', validateMasterApiKey, asyncHandler(async (req: Request, res: Response) => {
    const mods = await getModsWithAllUpdates();
    res.status(200).json({ backupDate: new Date(), mods });
}));

ROUTER.post('/restore', validateMasterApiKey, asyncHandler(async (req: Request, res: Response) => {
    if (!isModsEmpty() || !isUpdatesEmpty()) throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Database not empty");

    const backup: Backup = req.body;
    for (const mod of backup.mods) {
        delete mod._id; // Safety precaution
        
        const _mod = await createMod(mod);
        
        mod.updates = mod.updates.sort((a, b) => {
            const date1 = new Date(a.publishDate).getTime();
            const date2 = new Date(b.publishDate).getTime();

            return date1 - date2;
        })
        
        for (const update of mod.updates) {
            delete update._id; // Safety precaution
            update.mod = _mod._id;
            await createUpdate(update);
        }
    }

    res.status(200).json({ status: 200, message: "OK" });
}));

export default ROUTER;

export type Backup = {
    backupDate: string | Date,
    mods: IMod[],
}
