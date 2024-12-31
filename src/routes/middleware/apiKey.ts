import { NextFunction, Request, Response } from "express";

import * as AuthenticationAspect from "../../aspects/AuthenticationAspect";

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    AuthenticationAspect.validateHeaders(req);
    next();
}

export const validateMasterApiKey = (req: Request, res: Response, next: NextFunction) => {
    AuthenticationAspect.validateHeadersMaster(req);
    next();
}
