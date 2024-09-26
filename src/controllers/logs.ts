import { Request, Response } from "express";

export function logsGet(_req: Request, res: Response) {
  res.status(200).json({ logs: "OK" });
}

export function logsList(_req: Request, res: Response) {
  res.status(200).json({ list: "OK" });
}
