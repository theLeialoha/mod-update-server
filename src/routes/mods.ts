import { NextFunction, Request, Response, Router } from "express";
const ROUTER = Router();

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
    console.log('Time: ', Date.now());
    next();
}

ROUTER.use(timeLog);

// define the home page route
ROUTER.get('/', (req: Request, res: Response) => {
    res.send('Birds home page');
});

// define the about route
ROUTER.get('/about', (req: Request, res: Response) => {
    res.send('About birds');
});

export default ROUTER;