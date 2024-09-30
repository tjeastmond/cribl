import { isJSON, parseJSON, parseJSONArray } from "@reader/parsers/json";

describe("isJSON", () => {
  it("should return true for valid JSON strings", () => {
    expect(isJSON('{"key": "value"}')).toBe(true);
    expect(isJSON("[]")).toBe(true);
    expect(isJSON('{"key": [1, 2, 3]}')).toBe(true);
  });

  it("should return false for invalid JSON strings", () => {
    expect(isJSON('{key: "value"}')).toBe(false);
    expect(isJSON('["value",]')).toBe(false);
    expect(isJSON('{"key": "value"')).toBe(false);
  });
});

describe("parseJSON", () => {
  it("should return the original string for non-JSON input", () => {
    expect(parseJSON("not a json")).toBe("not a json");
  });

  it("should parse valid JSON strings correctly", () => {
    expect(parseJSON('{"key": "value"}')).toEqual({ key: "value" });
    expect(parseJSON("[1, 2, 3]")).toEqual([1, 2, 3]);
  });
});

describe("parseJSONArray", () => {
  it("should return an array with original strings for invalid JSON", () => {
    const input = ["valid json", "not json"];
    const output = parseJSONArray(input);
    expect(output).toEqual(["valid json", "not json"]);
  });

  it("should parse valid JSON strings in an array correctly", () => {
    const input = ['{"key1": "value1"}', '{"key2": "value2"}'];
    const output = parseJSONArray(input);
    expect(output).toEqual([{ key1: "value1" }, { key2: "value2" }]);
  });
});
