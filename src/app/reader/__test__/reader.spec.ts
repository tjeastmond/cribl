import path from "path";
import { readLogFile } from "@reader/main";

describe("readLogFile", () => {
  const smallLog = path.join(__dirname, "/fixtures/small.log");
  const emptyLog = path.join(__dirname, "/fixtures/empty.log");
  const fakeLog = path.join(__dirname, "/fixtures/fake.log");
  const tenLinesLog = path.join(__dirname, "/fixtures/tenLines.log");

  it("should read the last lines from the log file", async () => {
    const result = await readLogFile(smallLog, 3);
    expect(result).toHaveLength(3);
    expect(result).toEqual(["Line Three", "Line Two", "Line One"]);

    const result2 = await readLogFile(smallLog, 1000);
    expect(result2).toHaveLength(3);
  });

  it("should provide one result", async () => {
    const result = await readLogFile(smallLog, 1);
    expect(result).toHaveLength(1);
    expect(result).toEqual(["Line Three"]);
  });

  it("should return an empty array if the file is empty", async () => {
    const result = await readLogFile(emptyLog, 3);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("should return an empty array if the file is empty", async () => {
    const result = await readLogFile(emptyLog, 3);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("should read the ten lines from the test file in the correct order", async () => {
    const restult = await readLogFile(tenLinesLog, 10);
    expect(restult).toHaveLength(10);
  });

  it("should handle errors when opening the file", async () => {
    await expect(readLogFile(fakeLog)).rejects.toThrow("ENOENT: no such file or directory, stat");
  });
});
