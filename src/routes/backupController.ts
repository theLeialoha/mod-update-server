import { Request, Response, Router } from "express";
const ROUTER = Router();

import * as BackupService from "../services/backupService";
import { validateMasterApiKey } from "./middleware/apiKey";
import { HttpStatus, PassErrorToParent, ResponseStatusException } from "../types/errors";


ROUTER.get('/', validateMasterApiKey, (req: Request, res: Response) => {
    res.status(200).json(BackupService.getBackup());
});

ROUTER.post('/restore', validateMasterApiKey, (req: Request, res: Response) => {
    if (!BackupService.restore(req.body)) throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Database not empty");
    else res.status(200).json({ status: 200, message: "OK" });
});

ROUTER.use(PassErrorToParent);

export default ROUTER;

