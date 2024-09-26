import { Request, Response, NextFunction } from "express";

export function notFoundHandler(_: Request, res: Response, __: NextFunction) {
  res.status(404).json({ error: "Not Found" });
}

// prettier-ignore
export function errorHandler(err: Error, _: Request, res: Response, _next: NextFunction) {
  console.error(err.stack);
  res.status(500).send(`Internal Server Error`);
}

/**
 * Wraps an async route handler to catch any errors and pass them to the
 * error handler. Basically, this helps avoid a million try/catch blocks.
 *
 * @param fn - The async route handler.
 * @returns The wrapped route handler.
 */
export function asyncHandler(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
