import { NextFunction, Request, Response } from "express";

import * as AuthenticationAspect from "../../aspects/AuthenticationAspect";

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    AuthenticationAspect.validateHeaders(req).catch(e => e).then(next);
}

export const validateMasterApiKey = (req: Request, res: Response, next: NextFunction) => {
    AuthenticationAspect.validateHeadersMaster(req).catch(e => e).then(next);
}
