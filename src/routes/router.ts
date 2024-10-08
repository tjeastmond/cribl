import authenticate from "@middleware/authenticate";
import { readLogFile } from "@reader/main";
import { asyncHandler, errorHandler, notFoundHandler } from "@routes/serverHandlers";
import express, { NextFunction as Next, Request, Response } from "express";

function healthcheckHandler(_req: Request, res: Response) {
  res.status(200).json({ health: "OK" });
}

/**
 * Handles the HTTP request to retrieve log entries from a specified log file.
 *
 * @param {Request}
 * @param {Response}
 * @throws {Error} - If the fileName is missing, a 400 status response is sent.
 */
export async function getLogs(req: Request, res: Response) {
  const fileName: string = req.body.file_name;
  const keywords: string[] = req.body.keywords || [];
  const numberRows: number = req.body.num_results || 100;

  if (!fileName) {
    res.status(400).json({ message: "Missing a valid file name" });
    return;
  }

  const results = await readLogFile(fileName, numberRows, keywords);

  res.status(200).json({
    count: results.length,
    keywords: keywords,
    data: results,
  });
}

export default function router(app: express.Application) {
  return function connectRouter(_req: Request, _res: Response, next: Next) {
    app.get("/", healthcheckHandler);
    app.post("/logs", authenticate, asyncHandler(getLogs));
    app.use(notFoundHandler);
    app.use(errorHandler);
    next();
  };
}
