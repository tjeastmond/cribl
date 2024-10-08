import { LOGS_DIRECTORY } from "@config/logsConfig";
import * as fs from "fs";
import path from "path";
import { ValidParams } from "./types";

export function logsPath(fileName: string) {
  return `${LOGS_DIRECTORY}/${fileName}`;
}

export function isNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isValidFilePath(filePath: string) {
  const normalizedPath = path.normalize(filePath);
  const absolutePath = path.resolve(normalizedPath);

  if (normalizedPath.includes("..") || normalizedPath.includes("./")) {
    return false;
  }

  const baseDirectory = path.resolve(LOGS_DIRECTORY);
  if (!absolutePath.startsWith(baseDirectory)) {
    return false;
  }

  return true;
}

export async function fileExists(filePath: string) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function validateParams(
  filePath: string,
  numberRows: number = 100,
): Promise<ValidParams> {
  const fullPath = logsPath(filePath);

  if (!isValidFilePath(fullPath) || !isNumber(numberRows)) {
    throw new Error("Invalid file path or number of rows");
  }

  if (!(await fileExists(fullPath))) {
    throw new Error(`File not found: ${filePath}`);
  }

  return { path: fullPath, numberRows };
}
