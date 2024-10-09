import { parse } from "@reader/parse";
import { searchBy } from "@reader/search";
import { ReadResult } from "@reader/types";
import { validateParams } from "@reader/utils";
import * as fs from "fs";

/**
 * Reads a document in reverse order, yielding after every chunk of data.
 *
 * @param {string} filePath - The path to the file to read from.
 * @param {number} [chunkSize=8192] - The size of each chunk to read.
 * @returns {Promise<ReadResult>}
 */
async function readFileReverse(filePath: string, chunkSize: number = 8192): Promise<ReadResult> {
  const handle = await fs.promises.open(filePath, "r");
  const fileSize = (await handle.stat()).size;

  let position: number = fileSize;
  let content: string = "";
  let lineBuffer: string = "";

  async function read(): Promise<string> {
    if (position <= 0) return "";

    [content, lineBuffer] = [lineBuffer, ""];
    const readSize = Math.min(chunkSize, position);
    position -= readSize;

    const buffer = Buffer.alloc(readSize);
    await handle.read(buffer, 0, readSize, position);
    content = buffer.toString("utf-8") + content;

    if (position > 0) {
      const newlineIndex = content.lastIndexOf("\n");
      if (newlineIndex !== -1) {
        lineBuffer = content.slice(0, newlineIndex);
        content = content.slice(newlineIndex + 1).trim();
      }
    }

    return content;
  }

  return {
    read,
    done: () => position <= 0,
    close: () => handle.close(),
  };
}

/**
 * Reads a log file in reverse order, retrieving a specified number of lines
 * and matching any keywords.
 *
 * @param {string} filePath - The path to the log file to read from.
 * @param {number} [needs=100] - The maximum number of lines to retrieve from the log file.
 * @param {string[]} [keywords=[]] - An array of keywords to search for in the log file content.
 * @param {number} [chunkSize=8192] - The size of each chunk to read.
 * @returns {Promise<Array<object | string>>}
 */
export async function readLogFile(
  filePath: string,
  needs: number = 100,
  keywords: string[] = [],
  chunkSize: number = 8192,
): Promise<Array<object | string>> {
  const validation = await validateParams(filePath, needs);
  const reader = await readFileReverse(validation.path, chunkSize);
  const rows: Array<object | string> = [];

  try {
    while (!reader.done() && rows.length < validation.numberRows) {
      const content = await reader.read();
      if (content) {
        rows.push(...parse(searchBy(content, validation.numberRows - rows.length, keywords)));
      }
    }
  } finally {
    await reader.close();
  }

  return rows;
}
