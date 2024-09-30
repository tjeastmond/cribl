import { readLogFile, fileExists } from "@reader/main";
import { Request, Response } from "express";

function logsPath(fileName: string) {
  return `${process.env.LOGS_DIR}${fileName}`;
}

/**
 * Handles the HTTP request to retrieve log entries from a specified log file.
 *
 * @param {Request} req - The Express request object containing the request data.
 * @param {Response} res - The Express response object used to send back the desired HTTP response.
 * @throws {Error} - If the fileName is missing, a 400 status response is sent.
 */
export async function getLogs(req: Request, res: Response) {
  const fileName = req.body.file_name;
  const keywords = req.body.keywords || [];
  const numResults = req.body.num_results || 100;

  if (!fileName) {
    res.status(400).json({ message: "Missing a valid file name" });
    return;
  }

  await fileExists(logsPath(fileName));

  const results = await readLogFile(logsPath(fileName as string), numResults, keywords);

  res.status(200).json({
    numResults: results.length,
    data: results,
  });
}
