import validApiTokens from "@config/validTokens";
import { NextFunction as Next, Request, Response } from "express";

/**
 * Middleware function to authenticate API requests.
 *
 * @param {Response} req - The HTTP request object.
 * @param {Request} res - The HTTP response object.
 * @param {Next} next - The next middleware function in the request-response cycle.
 */

export default function authenticate(req: Request, res: Response, next: Next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!validApiTokens.includes(token!)) {
    res.status(403).json({ message: "Access Forbidden" });
    return;
  }

  next();
}

// curl -H "Authorization: Bearer 935989e5-8293-4fef-9982-54167a2c85a7" http://localhost:3000/healthcheck
// curl -H "Authorization: Bearer token123" http://localhost:3000/healthcheck
// curl http://localhost:3000
