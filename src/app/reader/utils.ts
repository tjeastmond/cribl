import { LOGS_DIRECTORY } from "@config/logsConfig";
import * as fs from "fs";
import path from "path";
import { ValidParams } from "./types";

export function logsPath(fileName: string): string {
  return path.join(LOGS_DIRECTORY, path.normalize(fileName));
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isValidFilePath(filePath: string): boolean {
  return !filePath.includes("..") && !filePath.includes("./");
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function validateParams(
  filePath: string,
  numberRows: number = 100,
): Promise<ValidParams> {
  const fullPath = logsPath(filePath);

  if (!isValidFilePath(filePath)) {
    throw new Error("Invalid file path");
  }

  if (!isNumber(numberRows)) {
    throw new Error("Invalid number of rows");
  }

  if (!(await fileExists(fullPath))) {
    throw new Error(`File not found: ${filePath}`);
  }

  return { path: fullPath, numberRows };
}
