import authenticate from "@middleware/authenticate";
import readerHandler from "@routes/readerHandler";
import { asyncHandler, errorHandler, notFoundHandler } from "@routes/serverHandlers";
import express, { NextFunction as Next, Request, Response } from "express";

function healthcheckHandler(_req: Request, res: Response) {
  res.status(200).json({ health: "OK" });
}

export default function router(app: express.Application) {
  return function connectRouter(_req: Request, _res: Response, next: Next) {
    app.get("/", healthcheckHandler);
    app.post("/logs", authenticate, asyncHandler(readerHandler));
    app.use(notFoundHandler);
    app.use(errorHandler);
    next();
  };
}
