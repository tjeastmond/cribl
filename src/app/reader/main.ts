import { parse } from "@reader/parse";
import { searchBy } from "@reader/search";
import * as fs from "fs";
import path from "path";

/**
 * Reads data from a file and writes it to a buffer at a specified offset.
 *
 * @param {string} filePath - The path to the file to read from.
 * @param {Buffer} buffer - The buffer to write the data to.
 * @param {number} [offSet=0] - The offset in the buffer at which to start writing.
 * @param {number|null} readSize - The number of bytes to read from the file.
 * @param {number|null} position - The position in the file from which to start reading.
 * @returns {Promise<void>}
 */
async function readPromise(
  filePath: string,
  buffer: Buffer,
  offSet: number | 0,
  readSize: number | null,
  position: number | null,
): Promise<void> {
  const handle = await fs.promises.open(filePath, "r");
  try {
    await handle.read(buffer, offSet, readSize, position);
  } finally {
    await handle.close();
  }
}

/**
 * Reads a file in reverse order, returning chunks of data. To read the data, call the `read`
 * function to get the first chunk of data and so on until the `done` function returns true.
 *
 * @param {string} filePath - The path to the file to read from.
 * @returns {Promise<{ read: function, done: function }>}
 */
async function readFileReverse(filePath: string): Promise<{ read: Function; done: Function }> {
  const stats = await fs.promises.stat(filePath);
  const fileSize = stats.size;
  const chunkSize = 1024;

  let position: number = fileSize;
  let buffer: Buffer = Buffer.alloc(chunkSize);
  let content: string = "";
  let lineBuffer: string = "";

  async function read(): Promise<string | undefined> {
    if (position <= 0) return;

    [content, lineBuffer] = [lineBuffer, ""];
    const readSize = Math.min(chunkSize, position);
    position -= readSize;

    await readPromise(filePath, buffer, 0, readSize, position);
    content = buffer.toString("utf-8", 0, readSize) + content;

    if (position > 0) {
      const newlineIndex = content.indexOf("\n");
      lineBuffer = content.slice(0, newlineIndex);
      content = content.slice(newlineIndex + 1).trim();
    }

    return content;
  }

  function done() {
    return position <= 0;
  }

  return { read, done };
}

export async function fileExists(filePath: string) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return true;
  } catch (error) {
    throw new Error(`File not found: ${path.basename(filePath)}`);
  }
}

/**
 * Reads a log file in reverse order, retrieving a specified number of lines
 * and matching any keywords.
 *
 * @param {string} filePath - The path to the log file to read from.
 * @param {number} [needs=100] - The maximum number of lines to retrieve from the log file.
 * @param {string[]} [keywords=[]] - An array of keywords to search for in the log file content.
 * @returns {Promise<Array<object | string>>} A promise that resolves to an array of matched log entries.
 */
export async function readLogFile(
  filePath: string,
  needs: number = 100,
  keywords: string[] = [],
): Promise<Array<object | string>> {
  await fileExists(filePath);
  const reader = await readFileReverse(filePath);
  const count = needs || 100;
  const rows: Array<object | string> = [];

  while (!reader.done() && rows.length < count) {
    let content = await reader.read();

    if (content) {
      const found = searchBy(content, count - rows.length, keywords);
      rows.push(...parse(found));
    }
  }

  return rows;
}
