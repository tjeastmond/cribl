import * as fs from "fs";

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

function checkString(line: string, keywords: string[]) {
  return keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
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

async function readLogFile(filePath: string, needs: number = 10, keywords: string[] = []) {
  let reader = await readFileReverse(filePath);
  const count = Math.max(needs, 1);
  const rows: string[] = [];

  while (!reader.done() && rows.length < count) {
    let content = await reader.read();
    if (content) {
      const lines = content.split("\n");

      for (let i = lines.length - 1; i >= 0; --i) {
        if (rows.length >= count) break;

        const hasKeywords = keywords.length && checkString(lines[i], keywords);

        if (!keywords.length || hasKeywords) {
          rows.push(lines[i]);
        }
      }
    }
  }

  return rows;
}

async function test() {
  // const r = await readLogFile("test_data/10_apache.log", 100);
  const r = await readLogFile("test_data/10_apache.log", 100, ["OS X"]);
  console.log(r, r.length);
}

test();
