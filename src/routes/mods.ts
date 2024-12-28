import { Request, Response, Router } from "express";
import { API_KEY } from "../middleware/apiKey";
const ROUTER = Router();

/**
 * A list of all mods.
 */ 
ROUTER.get('/', (req: Request, res: Response) => {
    res.send('Birds home page');
});

/**
 * Adds a new mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/add', API_KEY, (req: Request, res: Response) => {
    res.send(req.params);
});

/**
 * Edits an existing mod. Requires an apikey in the header. See [Mod](#mod).
 */
ROUTER.post('/mods/edit/:modId', API_KEY, (req: Request, res: Response) => {
    res.send(req.params);
});

/**
 * A specific mod by its mod ID.
 */ 
ROUTER.get('/:modId', (req: Request, res: Response) => {
    res.send(req.params);
});

/**
 * Deletes a mod. Requires an apikey in the header.
 */ 
ROUTER.delete('/:modId', API_KEY, (req: Request, res: Response) => {
    res.send(req.params);
});

export default ROUTER;
