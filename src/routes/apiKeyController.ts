import { Request, Response, Router } from "express";
const ROUTER = Router();

import * as ApiKeyService from "../services/apiKeyService";
import { validateMasterApiKey } from "./middleware/apiKey";
import { HttpStatus, ResponseStatusException } from "../types/errors";


ROUTER.get('/', validateMasterApiKey, (req: Request, res: Response) => {
    res.status(200).json(ApiKeyService.getApiKeys());
});

ROUTER.post('/add', validateMasterApiKey, (req: Request, res: Response) => {
    res.status(200).json(ApiKeyService.addApiKey(req.body));
});

ROUTER.delete('/:apiKey', validateMasterApiKey, (req: Request, res: Response) => {
    if (!ApiKeyService.removeApiKey(req.params.apiKey))
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ApiKey not found");
    else res.status(200).json({ status: 200, message: "OK" });
});

export default ROUTER;

