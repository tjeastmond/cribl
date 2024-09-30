import { readLogFile } from "@reader/main";
import { Request, Response } from "express";

function logsPath(fileName: string) {
  return `${process.env.LOGS_DIR}${fileName}`;
}

export async function getLogs(req: Request, res: Response) {
  const fileName = req.body.file_name;
  const keywords = req.body.keywords || [];
  const numResults = req.body.num_results || 100;

  if (!fileName) {
    res.status(400).json({ message: "Missing a valid file name" });
    return;
  }

  const results = await readLogFile(logsPath(fileName as string), numResults, keywords);

  res.status(200).json({
    numResults: results.length,
    data: results,
  });
}
