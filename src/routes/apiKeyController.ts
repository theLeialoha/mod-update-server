import { Request, Response, Router } from "express";
const ROUTER = Router();

import * as ApiKeyService from "../services/apiKeyService";
import { validateMasterApiKey } from "./middleware/apiKey";


ROUTER.get('/', validateMasterApiKey, (req: Request, res: Response) => {
    res.status(200).send(ApiKeyService.getApiKeys());
});

ROUTER.post('/add', validateMasterApiKey, (req: Request, res: Response) => {
    res.status(200).send(ApiKeyService.addApiKey(req.body));
});

ROUTER.delete('/:apiKey', validateMasterApiKey, (req: Request, res: Response) => {
    try {
        if (!ApiKeyService.removeApiKey(req.params.apiKey)) res.send(404).send("ApiKey not found");
        else res.status(200).send("OK");
    } catch (e) {
        res.status(400).send(e);
    }
});

export default ROUTER;

