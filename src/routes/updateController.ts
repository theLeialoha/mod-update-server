import { Request, Response, Router } from "express";
import { validateApiKey } from "./middleware/apiKey";
const ROUTER = Router();

import * as UpdateService from "../services/updateService";
import { List, Optional } from "../types/java";
import { Update } from "../types/dtos";
import { HttpStatus, PassErrorToParent, ResponseStatusException } from "../types/errors";

// Make sure we only get the number (if it's a single value)
function parseNumber(query: any, defaultValue: number = 0): number {
    try {
        return typeof query == "string" ? parseInt(query) : defaultValue
    } catch (ignored) { return defaultValue; }
}

// All updates for all mods. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates?amount=16&page=0
ROUTER.get('/', (req: Request, res: Response) => {
    const queryAmount: number = parseNumber(req.query.amount, 25);
    const pageAmount: number = parseNumber(req.query.page, 0);

    // Keep limits in mind
    const amount = Math.max(0, Math.min(128, queryAmount)); // 0 <= amount <= 128
    const page = Math.max(0, pageAmount); // 0 <= page

    res.status(200).send(UpdateService.getUpdates(amount, page));
});

// All updates for a mod. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates/MOD_ID?amount=16&page=0
ROUTER.get('/:modId', (req: Request, res: Response) => {
    const queryAmount: number = parseNumber(req.query.amount, 25);
    const pageAmount: number = parseNumber(req.query.page, 0);

    // Keep limits in mind
    const amount = Math.max(0, Math.min(128, queryAmount)); // 0 <= amount <= 128
    const page = Math.max(0, pageAmount); // 0 <= page

    const modUpdates: Optional<List<Update>> = UpdateService.getModUpdates(req.params.modId, amount, page);
    if (modUpdates == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    else res.status(200).json(modUpdates);
});

// Adds a new update. Requires an apikey in the header. See [Update](#update).
// (POST) /updates/MOD_ID
ROUTER.post('/:modId', validateApiKey, (req: Request, res: Response) => {
    if (!UpdateService.addUpdate(req.params.modId, req.body)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mod does not exist");
    else res.status(201).json({ status: 201, message: "Created" });
});

// A specific update.
// (GET) /updates/MOD_ID/UPDATE_ID
ROUTER.get('/:modId/:updateId', (req: Request, res: Response) => {
    res.status(200).send(UpdateService.getUpdate(req.params.modId, parseNumber(req.params.updateId)));
});

// Updates an update.
// (POST) /updates/MOD_ID/UPDATE_ID
ROUTER.post('/:modId/:updateId', validateApiKey, (req: Request, res: Response) => {
    UpdateService.editUpdate(req.params.modId, parseNumber(req.params.updateId), req.body);
    res.status(200).json({ status: 200, message: "OK" });
});

// Deletes an update. Requires an apikey in the header.
// (DELETE) /updates/MOD_ID/UPDATE_ID
ROUTER.delete('/:modId', validateApiKey, (req: Request, res: Response) => {
    UpdateService.deleteUpdate(req.params.modId, parseNumber(req.params.updateId));
    res.status(200).json({ status: 200, message: "OK" });
});

ROUTER.use(PassErrorToParent);

export default ROUTER;

