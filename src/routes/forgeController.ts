import { Request, Response, Router } from "express";
import asyncHandler = require("express-async-handler");
const ROUTER = Router();

import { hasMod } from "../repositories/ModRepository";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { modUpdatesForLoader } from "../services/forgeUpdateService";

ROUTER.get('/forge/:modId', asyncHandler(async (req: Request, res: Response) => {
    const modId = req.params.modId;

    if (!await hasMod(modId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    const updates = await modUpdatesForLoader("forge", modId);
    res.status(200).json(updates);
}));

ROUTER.get('/neoforge/:modId', asyncHandler(async (req: Request, res: Response) => {
    const modId = req.params.modId;

    if (!await hasMod(modId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    const updates = await modUpdatesForLoader("neoforge", modId);
    res.status(200).json(updates);
}));

// TODO: Update Handler
// ROUTER.get('/fabric/:modId', (req: Request, res: Response) => {
//     modUpdates("fabric", req.params.modId, res);
// });

// ROUTER.get('/quilt/:modId', (req: Request, res: Response) => {
//     modUpdates("quilt", req.params.modId, res);
// });

export default ROUTER;

