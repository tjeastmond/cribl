import {
  checkString,
  getLastLine,
  searchByText,
  searchByArray,
  searchBy,
  SEARCHBY,
} from "../search";

describe("String Search Functions", () => {
  test("checkString should return true if any keyword is found", () => {
    const line = "This is a sample line.";
    const keywords = ["sample", "test"];
    expect(checkString(line, keywords)).toBe(true);
  });

  test("checkString should return false if no keywords are found", () => {
    const line = "This is a sample line.";
    const keywords = ["example", "demo"];
    expect(checkString(line, keywords)).toBe(false);
  });

  test("getLastLine should return last line and updated text", () => {
    const text = "First line\nSecond line\nLast line";
    const [lastLine, updatedText] = getLastLine(text);
    expect(lastLine).toBe("Last line");
    expect(updatedText).toBe("First line\nSecond line");
  });

  test("searchByText should return found lines based on keywords", () => {
    const text = "First line\nSecond line\nFinal line";
    const keywords = ["final"];
    const result = searchByText(text, 2, keywords);
    expect(result).toEqual(["Final line"]);
  });

  test("searchByArray should return found lines based on keywords", () => {
    const text = "First line\nSecond line\nFinal line";
    const keywords = ["first"];
    const result = searchByArray(text, 1, keywords);
    expect(result).toEqual(["First line"]);
  });

  test('searchBy should call searchByText when SEARCHBY is "text"', () => {
    const text = "First line\nSecond line\nFinal line";
    const keywords = ["final"];
    const result = searchBy(text, 1, keywords);
    expect(result).toEqual(["Final line"]);
  });

  test('searchBy should call searchByArray when SEARCHBY is "array"', () => {
    const originalSearchBy = SEARCHBY;
    // Temporarily switch SEARCHBY to "array" to test
    (global as any).SEARCHBY = "array";

    const text = "First line\nSecond line\nFinal line";
    const keywords = ["first"];
    const result = searchBy(text, 1, keywords);
    expect(result).toEqual(["First line"]);

    // Restore original SEARCHBY
    (global as any).SEARCHBY = originalSearchBy;
  });
});