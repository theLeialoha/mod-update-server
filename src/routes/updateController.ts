import { Request, Response, Router } from "express";
import asyncHandler = require("express-async-handler");
const ROUTER = Router();

import { createUpdateWithId, deleteUpdate, editUpdate, findUpdateByModAndId, getAllUpdatesWithMod, getModUpdates } from "../repositories/UpdateRepository";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { IModUpdate } from "../database";
import { Pageable } from "../repositories/Repository";
import { validateApiKey } from "./middleware/apiKey";

// Make sure we only get the number (if it's a single value)
function parseNumber(query: any, defaultValue: number = 0): number {
    try {
        return typeof query == "string" ? parseInt(query) : defaultValue
    } catch (ignored) { return defaultValue; }
}

// All updates for all mods. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates?amount=16&page=0
ROUTER.get('/', asyncHandler(async (req: Request, res: Response) => {
    const queryAmount: number = parseNumber(req.query.amount, 25);
    const pageAmount: number = parseNumber(req.query.page, 0);

    // Keep limits in mind
    const amount = Math.max(0, Math.min(128, queryAmount)); // 0 <= amount <= 128
    const page = Math.max(0, pageAmount); // 0 <= page
    const pageable: Pageable = { amount, page };

    const updates = await getAllUpdatesWithMod(pageable);
    res.status(200).send(updates);
}));

// All updates for a mod. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates/MOD_ID?amount=16&page=0
ROUTER.get('/:modId', asyncHandler(async (req: Request, res: Response) => {
    const queryAmount: number = parseNumber(req.query.amount, 25);
    const pageAmount: number = parseNumber(req.query.page, 0);

    // Keep limits in mind
    const amount = Math.max(0, Math.min(128, queryAmount)); // 0 <= amount <= 128
    const page = Math.max(0, pageAmount); // 0 <= page
    const pageable: Pageable = { amount, page };

    const modUpdates: IModUpdate[] = await getModUpdates(req.params.modId, pageable);
    // if (modUpdates == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    res.status(200).json(modUpdates);
}));

// Adds a new update. Requires an apikey in the header. See [Update](#update).
// (POST) /updates/MOD_ID
ROUTER.post('/:modId', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    const createdUpdate = await createUpdateWithId(req.params.modId, req.body);
    if (!createdUpdate) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update couldn't be create");
    res.status(201).json({ status: 201, message: "Created" });
}));

// A specific update.
// (GET) /updates/MOD_ID/UPDATE_ID
ROUTER.get('/:modId/:updateId', asyncHandler(async (req: Request, res: Response) => {
    const update = await findUpdateByModAndId(req.params.modId, parseNumber(req.params.updateId));
    if (update == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Update not found");
    res.status(200).send(update);
}));

// Updates an update.
// (POST) /updates/MOD_ID/UPDATE_ID
ROUTER.post('/:modId/:updateId', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    const wasUpdated = await editUpdate(req.params.modId, parseNumber(req.params.updateId), req.body);
    if (!wasUpdated) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Update not found");
    res.status(200).json({ status: 200, message: "OK" });
}));

// Deletes an update. Requires an apikey in the header.
// (DELETE) /updates/MOD_ID/UPDATE_ID
ROUTER.delete('/:modId/:updateId', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    const wasDeleted = await deleteUpdate(req.params.modId, parseNumber(req.params.updateId));
    if (!wasDeleted) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Update not found");
    res.status(200).json({ status: 200, message: "OK" });
}));

export default ROUTER;

