import { NextFunction, Request, Response } from "express";

import * as AuthenticationAspect from "../../aspects/AuthenticationAspect";

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthenticationAspect.validateHeaders(req);
        next();
    } catch (e) {
        next(e);
    }
}

export const validateMasterApiKey = (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthenticationAspect.validateHeadersMaster(req);
        next();
    } catch (e) {
        next(e);
    }
}
