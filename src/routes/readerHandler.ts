import { readLogFile } from "@reader/main";
import { Request, Response } from "express";

/**
 * Handles the HTTP request to retrieve log entries from a specified log file.
 *
 * @param {Request}
 * @param {Response}
 * @throws {Error} - If the fileName is missing, a 400 status response is sent.
 */
export async function readerHandler(req: Request, res: Response) {
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

export default readerHandler;
