import { parse } from "@reader/parse";
import { searchBy } from "@reader/search";
import { validateParams } from "@reader/utils";
import * as fs from "fs";

/**
 * Reads data from a file and writes it to a buffer at a specified offset.
 *
 * @param {string} filePath - The path to the file to read from.
 * @param {Buffer} buffer - The buffer to write the data to.
 * @param {number} [offSet=0] - The offset in the buffer to start writing.
 * @param {number|null} readSize - The number of bytes to read from the file.
 * @param {number|null} position - The position in the file to start reading.
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
 * Reads a document in reverse order, yielding after every chunk of data.
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

/**
 * Reads a log file in reverse order, retrieving a specified number of lines
 * and matching any keywords.
 *
 * @param {string} filePath - The path to the log file to read from.
 * @param {number} [needs=100] - The maximum number of lines to retrieve from the log file.
 * @param {string[]} [keywords=[]] - An array of keywords to search for in the log file content.
 * @returns {Promise<Array<object | string>>}
 */
export async function readLogFile(
  filePath: string,
  needs: number = 100,
  keywords: string[] = [],
): Promise<Array<object | string>> {
  const valid = await validateParams(filePath, needs);
  const reader = await readFileReverse(valid.path);
  const count = valid.numberRows;
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
