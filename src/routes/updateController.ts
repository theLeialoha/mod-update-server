import { Request, Response, Router } from "express";
import { validateApiKey } from "./middleware/apiKey";
const ROUTER = Router();

import * as UpdateService from "../services/updateService";
import { List, Optional } from "../types/java";
import { Update } from "../types/dtos";

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

    try {
        res.status(200).send(UpdateService.getUpdates(amount, page));
    } catch (e) { res.status(400).send(e); }
});

// All updates for a mod. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates/MOD_ID?amount=16&page=0
ROUTER.get('/:modId', (req: Request, res: Response) => {
    const queryAmount: number = parseNumber(req.query.amount, 25);
    const pageAmount: number = parseNumber(req.query.page, 0);

    // Keep limits in mind
    const amount = Math.max(0, Math.min(128, queryAmount)); // 0 <= amount <= 128
    const page = Math.max(0, pageAmount); // 0 <= page

    try {
        const modUpdates: Optional<List<Update>> = UpdateService.getModUpdates(req.params.modId, amount, page);
        if (modUpdates == null) res.status(404).send("Mod does not exist");
        else res.status(200).send(modUpdates);
    } catch (e) { res.status(400).send(e); }
});

// Adds a new update. Requires an apikey in the header. See [Update](#update).
// (POST) /updates/MOD_ID
ROUTER.post('/:modId', validateApiKey, (req: Request, res: Response) => {
    try {
        if (!UpdateService.addUpdate(req.params.modId, req.body))
            res.status(400).send("Mod does not exist");
        else res.status(201).send("Created");
    } catch (e) { res.status(400).send(e); }
});

// A specific update.
// (GET) /updates/MOD_ID/UPDATE_ID
ROUTER.get('/:modId/:updateId', (req: Request, res: Response) => {
    try {
        res.status(200).send(UpdateService.getUpdate(req.params.modId, parseNumber(req.params.updateId)));
    } catch (e) { res.status(400).send(e); }
});

// Updates an update.
// (POST) /updates/MOD_ID/UPDATE_ID
ROUTER.post('/:modId/:updateId', validateApiKey, (req: Request, res: Response) => {
    try {
        UpdateService.editUpdate(req.params.modId, parseNumber(req.params.updateId), req.body);
        res.status(200).send("OK");
    } catch (e) { res.status(400).send(e); }
});

// Deletes an update. Requires an apikey in the header.
// (DELETE) /updates/MOD_ID/UPDATE_ID
ROUTER.delete('/:modId', validateApiKey, (req: Request, res: Response) => {
    try {
        UpdateService.deleteUpdate(req.params.modId, parseNumber(req.params.updateId));
    } catch (e) {}
    res.status(200).send("OK");
});


export default ROUTER;

