import { Request, Response, Router } from "express";
import { validateApiKey } from "./middleware/apiKey";
const ROUTER = Router();

import * as ModService from "../services/modService";
import { Optional } from "../types/java";
import { ModWithUpdateCount } from "../types/dtos";

/**
 * A list of all mods.
 */ 
ROUTER.get('/', (req: Request, res: Response) => {
    try {
        res.status(200).send(ModService.getMods());
    } catch (e) { res.status(400).send(e); }
});

/**
 * Adds a new mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/add', validateApiKey, (req: Request, res: Response) => {
    try {
        if (!ModService.addMod(req.body)) res.status(409).send("Mod already exists");
        else res.status(201).send("Created");
    } catch (e) { res.status(400).send(e); }
});

/**
 * Edits an existing mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/mods/edit/:modId', validateApiKey, (req: Request, res: Response) => {
    try {
        if (!ModService.editMod(req.params.modId, req.body)) res.status(404).send("Mod does not exist");
        else res.status(200).send("OK");
    } catch (e) { res.status(400).send(e); }
});

/**
 * A specific mod by its mod ID.
 */ 
ROUTER.get('/:modId', (req: Request, res: Response) => {
    try {
        const optionalMod: Optional<ModWithUpdateCount> = ModService.getMod(req.params.modId);
        if (optionalMod == null) res.status(404).send("Mod does not exist");
        else res.status(200).send(optionalMod);
    } catch (e) { res.status(400).send(e); }
});

/**
 * Deletes a mod. Requires an apikey in the header.
 */ 
ROUTER.delete('/:modId', validateApiKey, (req: Request, res: Response) => {
    try {
        ModService.deleteMod(req.params.modId);
    } catch (e) {}
    res.status(200).send("OK");
});

export default ROUTER;
