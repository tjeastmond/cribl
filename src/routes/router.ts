import { logsGet, logsList } from "@controllers/logs";
import authenticate from "@middleware/authenticate";
import { errorHandler, notFoundHandler } from "@routes/serverHandlers";
import express, { NextFunction as Next, Request, Response } from "express";

function healthcheckHandler(_req: Request, res: Response) {
  res.status(200).json({ health: "OK" });
}

export default function router(app: express.Application) {
  return function connectRouter(_req: Request, _res: Response, next: Next) {
    app.get("/", healthcheckHandler);
    app.get("/api/logs/get", authenticate, logsGet);
    app.get("/api/logs/list", authenticate, logsList);
    app.use(notFoundHandler);
    app.use(errorHandler);
    next();
  };
}
