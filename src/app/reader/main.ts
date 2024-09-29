import * as fs from "fs";
import { searchBy } from "./search";

async function readPromise(
  filePath: string,
  buffer: Buffer,
  offSet: number | 0,
  readSize: number | null,
  position: number | null,
) {
  const handle = await fs.promises.open(filePath, "r");
  try {
    await handle.read(buffer, offSet, readSize, position);
  } finally {
    await handle.close();
  }
}

async function readFileReverse(filePath: string) {
  const stats = await fs.promises.stat(filePath);
  const fileSize = stats.size;
  const chunkSize = 1024;

  let position: number = fileSize;
  let buffer: Buffer = Buffer.alloc(chunkSize);
  let content: string = "";
  let lineBuffer: string = "";

  async function read() {
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
