import { NextFunction, Request, Response } from "express";

export default function HomeMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Request: ", req.headers);
  next();
}
