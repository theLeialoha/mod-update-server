import { NextFunction, Request, Response } from "express";

export const API_KEY = (req: Request, res: Response, next: NextFunction) => {
    console.log('USING API KEY');
    next();
}
