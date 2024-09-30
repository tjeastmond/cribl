import { JSONParser } from "@reader/parsers/jsonParser";

describe("JSONParser", () => {
  let parser: JSONParser;

  beforeEach(() => {
    parser = new JSONParser([]);
  });

  describe("isValid", () => {
    it("should return true for valid JSON strings", () => {
      expect(parser.isValid('{"key": "value"}')).toBe(true);
      expect(parser.isValid("[]")).toBe(true);
      expect(parser.isValid('{"key": [1, 2, 3]}')).toBe(true);
    });

    it("should return false for invalid JSON strings", () => {
      expect(parser.isValid('{key: "value"}')).toBe(false);
      expect(parser.isValid('["value",]')).toBe(false);
      expect(parser.isValid('{"key": "value"')).toBe(false);
    });
  });

  describe("parseLine", () => {
    it("should return the original string for non-JSON input", () => {
      expect(parser.parseLine("not a json")).toBe("not a json");
    });

    it("should parse valid JSON strings correctly", () => {
      expect(parser.parseLine('{"key": "value"}')).toEqual({ key: "value" });
      expect(parser.parseLine("[1, 2, 3]")).toEqual([1, 2, 3]);
    });
  });

  describe("parse", () => {
    it("should return an array with original strings for invalid JSON", () => {
      const input = ["valid json", "not json"];
      const parser2 = new JSONParser(input);
      const output = parser2.parse();
      expect(output).toEqual(["valid json", "not json"]);
    });

    it("should parse valid JSON strings in an array correctly", () => {
      const input = ['{"key1": "value1"}', '{"key2": "value2"}'];
      const parser3 = new JSONParser(input);
      const output = parser3.parse();
      expect(output).toEqual([{ key1: "value1" }, { key2: "value2" }]);
    });
  });
});
