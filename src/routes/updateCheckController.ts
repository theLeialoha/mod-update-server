import { Request, Response, Router } from "express";
const ROUTER = Router();

import * as ModService from "../services/modService";
import * as UpdateCheckService from "../services/updateCheckService";

function modUpdates(loader: string, modId: string, res: Response): void {
    try {
        if (!ModService.doesModExist(modId)) res.status(404).send("Mod does not exist");
        else res.status(200).send(UpdateCheckService.modUpdatesForLoader(loader, modId)); 
    } catch (e) { res.status(400).send(e); }
}

ROUTER.get('/forge/:modId', (req: Request, res: Response) => {
    modUpdates("forge", req.params.modId, res);
});

ROUTER.get('/neoforge/:modId', (req: Request, res: Response) => {
    modUpdates("neoforge", req.params.modId, res);
});

ROUTER.get('/fabric/:modId', (req: Request, res: Response) => {
    modUpdates("fabric", req.params.modId, res);
});

ROUTER.get('/quilt/:modId', (req: Request, res: Response) => {
    modUpdates("quilt", req.params.modId, res);
});

export default ROUTER;

