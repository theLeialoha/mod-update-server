import { Request, Response, Router } from "express";
const ROUTER = Router();

import * as ModService from "../services/modService";
import * as ForgeUpdateService from "../services/forgeUpdateService";
import { HttpStatus, PassErrorToParent, ResponseStatusException } from "../types/errors";

function modUpdatesForLoader(loader: string, modId: string, res: Response): void {
    if (!ModService.doesModExist(modId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    else res.status(200).json(ForgeUpdateService.modUpdatesForLoader(loader, modId));
}

ROUTER.get('/forge/:modId', (req: Request, res: Response) => {
    modUpdatesForLoader("forge", req.params.modId, res);
});

ROUTER.get('/neoforge/:modId', (req: Request, res: Response) => {
    modUpdatesForLoader("neoforge", req.params.modId, res);
});

// TODO: Update Handler
// ROUTER.get('/fabric/:modId', (req: Request, res: Response) => {
//     modUpdates("fabric", req.params.modId, res);
// });

// ROUTER.get('/quilt/:modId', (req: Request, res: Response) => {
//     modUpdates("quilt", req.params.modId, res);
// });

ROUTER.use(PassErrorToParent);

export default ROUTER;

