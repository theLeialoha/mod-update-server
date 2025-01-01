import { Request, Response, Router } from "express";
import { validateApiKey } from "./middleware/apiKey";
const ROUTER = Router();

import * as ModService from "../services/modService";
import { Optional } from "../types/java";
import { HttpStatus, PassErrorToParent, ResponseStatusException } from "../types/errors";
import { ModAndUpdateCount } from "../types/entities";

/**
 * A list of all mods.
 */ 
ROUTER.get('/', (req: Request, res: Response) => {
    res.status(200).json(ModService.getMods());
});

/**
 * Adds a new mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/add', validateApiKey, (req: Request, res: Response) => {
    if (!ModService.addMod(req.body)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Mod already exists");
    else res.status(201).json({ status: 201, message: "Created" });
});

/**
 * Edits an existing mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/edit/:modId', validateApiKey, (req: Request, res: Response) => {
    if (!ModService.editMod(req.params.modId, req.body)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    else res.status(200).json({ status: 200, message: "OK" });
});

/**
 * A specific mod by its mod ID.
 */ 
ROUTER.get('/:modId', (req: Request, res: Response) => {
    const optionalMod: Optional<ModAndUpdateCount> = ModService.getMod(req.params.modId);
    if (optionalMod == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    else res.status(200).json(optionalMod);
});

/**
 * Deletes a mod. Requires an apikey in the header.
 */ 
ROUTER.delete('/:modId', validateApiKey, (req: Request, res: Response) => {
    ModService.deleteMod(req.params.modId);
    res.status(200).json({ status: 200, message: "OK" });
});

ROUTER.use(PassErrorToParent);

export default ROUTER;
