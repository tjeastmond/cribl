import express, { Request, Response, NextFunction as Next } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

export default function middleware(app: express.Application) {
  return function connectMiddleware(_req: Request, _res: Response, next: Next) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ methods: ["GET", "POST"] }));
    app.use(helmet.hidePoweredBy());
    app.use(morgan("dev"));
    app.use(helmet());
    next();
  };
}
