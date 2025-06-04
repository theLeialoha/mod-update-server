import { Request, Response, Router } from "express";
import asyncHandler = require("express-async-handler");
const ROUTER = Router();

import { addApiKey, getApiKeys, removeApiKey } from "../repositories/ApiKeyRepository";
import { HttpStatus, ResponseStatusException } from "../types/errors";
import { validateMasterApiKey } from "./middleware/apiKey";


ROUTER.get('/', validateMasterApiKey, asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await getApiKeys());
}));

ROUTER.post('/add', validateMasterApiKey, asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await addApiKey(req.body?.mods));
}));

ROUTER.delete('/:apiKey', validateMasterApiKey, asyncHandler(async (req: Request, res: Response) => {
    const successful = await removeApiKey(req.params.apiKey);

    if (!successful) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ApiKey not found");
    else res.status(200).json({ status: 200, message: "OK" });
}));

export default ROUTER;

