import { Request, Response, Router } from "express";
import asyncHandler = require("express-async-handler");
const ROUTER = Router();

import { createMod, deleteByModId, getAllMods, getModWithUpdateCount, hasMod, updateMod } from "../repositories/ModRepository";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { removeAllByMod } from "../repositories/UpdateRepository";
import { validateApiKey } from "./middleware/apiKey";

/**
 * A list of all mods.
 */ 
ROUTER.get('/', asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await getAllMods());
}));

/**
 * Adds a new mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/add', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    if (await createMod(req.body) == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "Mod already exists");
    res.status(201).json({ status: 201, message: "Created" });
}));

/**
 * Edits an existing mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/edit/:modId', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    if (!await hasMod(req.params.modId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    if (!await updateMod(req.params.modId, req.body)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod couldn't be updated");
    res.status(200).json({ status: 200, message: "OK" });
}));

/**
 * A specific mod by its mod ID.
 */ 
ROUTER.get('/:modId', asyncHandler(async (req: Request, res: Response) => {
    const mod = await getModWithUpdateCount(req.params.modId);
    if (mod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    else res.status(200).json(mod);
}));

/**
 * Deletes a mod. Requires an apikey in the header.
 */ 
ROUTER.delete('/:modId', validateApiKey, asyncHandler(async (req: Request, res: Response) => {
    const deletedUpdates = await removeAllByMod(req.params.modId);
    const wasDeleted = await deleteByModId(req.params.modId);
    if (!wasDeleted) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    res.status(200).json({ status: 200, message: "OK" });
}));

export default ROUTER;
