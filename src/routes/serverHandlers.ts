import { Request, Response, NextFunction as Next } from "express";

export function notFoundHandler(_: Request, res: Response, __: Next) {
  res.status(404).json({ error: "Not Found" });
}

// prettier-ignore
export function errorHandler(err: Error, _: Request, res: Response, _next: Next) {
  console.error("LOG API ERROR: ", err.stack);
  res.status(500).send(`Internal Server Error`);
}

/**
 * Wraps an async route handler to catch any errors and pass them to the
 * error handler. Basically, this helps avoid a million try/catch blocks.
 *
 * @param {Function} fn - The async route handler.
 */
export function asyncHandler(fn: Function) {
  return function (req: Request, res: Response, next: Next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
