import { Request, Response, Router } from "express";
const ROUTER = Router();

import * as BackupService from "../services/backupService";
import { validateMasterApiKey } from "./middleware/apiKey";


ROUTER.get('/', validateMasterApiKey, (req: Request, res: Response) => {
    res.status(200).send(BackupService.getBackup());
});

ROUTER.post('/restore', validateMasterApiKey, (req: Request, res: Response) => {
    try {
        if (!BackupService.restore(req.body)) res.send(406).send("Database not empty");
        else res.status(200).send("OK");
    } catch (e) {
        res.status(400).send(e);
    }
});

export default ROUTER;

