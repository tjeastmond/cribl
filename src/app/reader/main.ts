import * as fs from "fs";
import { searchBy } from "@reader/search";

/**
 * Reads data from a file and writes it to a buffer at a specified offset.
 *
 * @param {string} filePath - The path to the file to read from.
 * @param {Buffer} buffer - The buffer to write the data to.
 * @param {number} [offSet=0] - The offset in the buffer at which to start writing.
 * @param {number|null} readSize - The number of bytes to read from the file.
 * @param {number|null} position - The position in the file from which to start reading.
 * @returns {Promise<void>} A promise that resolves when the read operation is complete.
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
 * Reads a file in reverse order, returning chunks of data until the
 * beginning of the file is reached. The text is returned in chunks and waits for the next
 * read to be called before reading the next chunk.
 *
 * @param {string} filePath - The path to the file to read from.
 * @returns {Promise<{ read: function, done: function }>} An object containing the
 *          read function to retrieve the next chunk of data and
 *          a done function to check if the end of the file has been reached.
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

export async function readLogFile(filePath: string, needs: number = 10, keywrods: string[] = []) {
  let reader = await readFileReverse(filePath);
  const count = Math.max(needs, 1);
  const rows: string[] = [];

  while (!reader.done() && rows.length < count) {
    let content = await reader.read();

    if (content) {
      const found = searchBy(content, count - rows.length, keywrods);
      rows.push(...found);
    }
  }

  return rows;
}
