import { readLogFile, fileExists } from "@reader/main";
import { isNumber } from "@utils/check";
import { Request, Response } from "express";

function logsPath(fileName: string) {
  return `/var/log/${fileName}`;
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
  const numResults: number = req.body.num_results || 100;

  if (!fileName) {
    res.status(400).json({ message: "Missing a valid file name" });
    return;
  }

  if (!isNumber(numResults) || numResults <= 0) {
    res.status(400).json({ message: "Invalid number of results" });
    return;
  }

  await fileExists(logsPath(fileName));

  const results = await readLogFile(logsPath(fileName), numResults, keywords);

  res.status(200).json({
    count: results.length,
    keywords: keywords,
    data: results,
  });
}
