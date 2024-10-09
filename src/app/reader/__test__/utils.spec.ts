import { LOGS_DIRECTORY } from "@config/logsConfig";
import { fileExists, isNumber, isValidFilePath, logsPath, validateParams } from "@reader/utils";
import path from "path";

describe("logs utilities", () => {
  describe("logsPath", () => {
    it("should construct the correct logs path", () => {
      const fileName = "test.log";
      const expectedPath = `${LOGS_DIRECTORY}/${fileName}`;
      expect(logsPath(fileName)).toBe(expectedPath);
    });
  });

  describe("isNumber", () => {
    it("should return true for valid numbers", () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-456)).toBe(true);
    });

    it("should return false for non-numeric values", () => {
      expect(isNumber("123")).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe("isValidFilePath", () => {
    it('should return false for paths containing ".."', () => {
      expect(isValidFilePath("../file.log")).toBe(false);
    });

    it('should return false for relative paths containing "./"', () => {
      expect(isValidFilePath("./file.log")).toBe(false);
    });

    it("should return false for paths outside the logs directory", () => {
      const outsidePath = "../outsideDir/file.log";
      expect(isValidFilePath(outsidePath)).toBe(false);
    });

    it("should return true for valid paths", () => {
      const validPath = path.join(LOGS_DIRECTORY, "file.log");
      expect(isValidFilePath(validPath)).toBe(true);
    });
  });

  describe("fileExists", () => {
    it("should return true if file exists", async () => {
      const result = await fileExists(logsPath("10_apache.log"));
      expect(result).toBe(true);
    });

    it("should return false if file does not exist", async () => {
      const result = await fileExists("nonExistingFile.log");
      expect(result).toBe(false);
    });
  });

  describe("validateParams", () => {
    it("should throw an error if file path is invalid", async () => {
      await expect(validateParams("../invalidPath.log", 100)).rejects.toThrow(
        "Invalid file path or number of rows",
      );
    });

    it("should throw an error if numberRows is not a number", async () => {
      await expect(validateParams("10_apache.log", NaN)).rejects.toThrow(
        "Invalid file path or number of rows",
      );
    });

    it("should throw an error if file does not exist", async () => {
      await expect(validateParams("nonExistingFile.log", 100)).rejects.toThrow(
        "File not found: nonExistingFile.log",
      );
    });

    it("should return valid params if everything is correct", async () => {
      const validPath = "tenLines.log";
      const result = await validateParams(validPath, 100);
      expect(result).toEqual({ path: logsPath(validPath), numberRows: 100 });
    });
  });
});
