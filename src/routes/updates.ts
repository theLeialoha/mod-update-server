import { Request, Response, Router } from "express";
import { API_KEY } from "../middleware/apiKey";
const ROUTER = Router();

// All updates for all mods. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates?amount=16&page=0
ROUTER.get('/', (req: Request, res: Response) => {
    res.send('Birds home page');
});

// All updates for a mod. Query parameters: `amount` for the update count per page, `page` for the page.
// (GET) /updates/MOD_ID?amount=16&page=0
ROUTER.get('/:modId', (req: Request, res: Response) => {
    res.send(req.params);
});

// A specific update.
// (GET) /updates/MOD_ID/UPDATE_ID
ROUTER.get('/:modId/:updateId', (req: Request, res: Response) => {
    res.send(req.params);
});

// Adds a new update. Requires an apikey in the header. See [Update](#update).
// (POST) /updates/MOD_ID
ROUTER.get('/:modId', API_KEY, (req: Request, res: Response) => {
    res.send(req.params);
});

// Updates an update.
// (POST) /updates/MOD_ID/UPDATE_ID
ROUTER.get('/:modId/:updateId', API_KEY, (req: Request, res: Response) => {
    res.send(req.params);
});

// Deletes an update. Requires an apikey in the header.
// (DELETE) /updates/MOD_ID/UPDATE_ID
ROUTER.get('/:modId', API_KEY, (req: Request, res: Response) => {
    res.send(req.params);
});


export default ROUTER;

