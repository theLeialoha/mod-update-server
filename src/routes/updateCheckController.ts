import { Request, Response, Router } from "express";
import asyncHandler = require("express-async-handler");
const ROUTER = Router();

import { hasMod } from "../repositories/ModRepository";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { modUpdatesForLoader } from "../services/updateCheckService";

async function modUpdates(loader: string, modId: string, res: Response): Promise<void> {
    if (!await hasMod(modId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    const updates = await modUpdatesForLoader(loader, modId);
    res.status(200).json(updates);
}

ROUTER.get('/forge/:modId', asyncHandler((req: Request, res: Response) => {
    modUpdates("forge", req.params.modId, res);
}));

ROUTER.get('/neoforge/:modId', asyncHandler((req: Request, res: Response) => {
    modUpdates("neoforge", req.params.modId, res);
}));

ROUTER.get('/fabric/:modId', asyncHandler((req: Request, res: Response) => {
    modUpdates("fabric", req.params.modId, res);
}));

ROUTER.get('/quilt/:modId', asyncHandler((req: Request, res: Response) => {
    modUpdates("quilt", req.params.modId, res);
}));

export default ROUTER;

