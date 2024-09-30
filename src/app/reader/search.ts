/**
 * Defines the allowed types for the search method.
 * Can be either "array" or "text". Defaults to "text".
 */
type SearchByType = "array" | "text";
const DEFAULT_SEARCHBY: SearchByType = "text";

/**
 * Checks if any keyword exists within a given string, ignoring case.
 *
 * @param {string} line - The string to be checked for keywords.
 * @param {string[]} keywords - An array of keywords to search for within the line.
 * @returns {boolean} Returns true if any keyword is found in the line; otherwise, false.
 */
export function checkString(line: string, keywords: string[]): boolean {
  return keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Extracts the last line from a given text and returns it along with the remaining text.
 *
 * @param {string} text - The input text to be processed.
 * @returns {[string, string]} An array containing the last line of the input and the remaining text.
 */
export function getLastLine(text: string): [string, string] {
  const trimmedText = text.trimEnd();
  const index = trimmedText.lastIndexOf("\n");
  const lastLine = index === -1 ? trimmedText : trimmedText.substring(index + 1);
  const updatedText = index === -1 ? "" : trimmedText.substring(0, index);
  return [lastLine, updatedText];
}

/**
 * Returns an array of strings pulled from the input text by searching each line.
 *
 * @param {string} text - The text to search through, filtered if keywords are provided.
 * @param {number} needed - The maximum number of results expected.
 * @param {string[]} [keywords=[]] - An optional array of keywords to filter the results.
 * @returns {string[]} An array of strings containing log lines, filtered if keywords are provided.
 */
export function searchByText(text: string, needed: number, keywords: string[] = []): string[] {
  const found: string[] = [];
  let remainingText = text;

  while (remainingText.length > 0 && found.length < needed) {
    const [lastLine, restOfText] = getLastLine(remainingText);
    remainingText = restOfText;

    if (!keywords.length || checkString(lastLine, keywords)) {
      found.push(lastLine);
    }
  }

  return found;
}

/**
 * Returns an array of strings pulled from the input text by searching each line.
 *
 * @param {string} text - The text to search through. Each line will be checked.
 * @param {number} needed - The maximum number of results expect.
 * @param {string[]} [keywords=[]] - An optional array of keywords to filter the results.
 * @returns {string[]} An array of strings containing log lines, filtered if keywords are provided.
 */
export function searchByArray(text: string, needed: number, keywords: string[] = []): string[] {
  const found: string[] = [];
  const lines = text.split("\n");

  for (let i = lines.length - 1; i >= 0; --i) {
    if (found.length >= needed) break;
    if (!keywords.length || checkString(lines[i], keywords)) {
      found.push(lines[i]);
    }
  }

  return found;
}

/**
 * Returns an array of strings pulled from log texts, and may by filtered by keywords.
 *
 * @param {string} text - The text to search within.
 * @param {number} needed - The maximum number of results to return.
 * @param {string[]} [keywords=[]] - An array of keywords to filter the results.
 * @param {SearchByType} [searchByValue=DEFAULT_SEARCHBY] - The method to use for log searching.
 *                                                          Can be either "array" to search by lines
 *                                                          or "text" to search using line extraction.
 * @returns {string[]} An array of strings containing log lines, filtered if keywords are provided.
 */
export function searchBy(
  text: string,
  needed: number,
  keywords: string[] = [],
  searchByValue: SearchByType = DEFAULT_SEARCHBY,
): string[] {
  const func = searchByValue === "array" ? searchByArray : searchByText;
  return func(text, needed, keywords);
}
