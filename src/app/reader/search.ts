/**
 * Defines the allowed types for the search method.
 * Can be either "array" or "text". Defaults to "text".
 */
type SearchByType = "array" | "text";
const DEFAULT_SEARCHBY: SearchByType = "text";

/**
 * Checks if any keyword exists within a given string, ignoring case.
 *
 * @param line - String to check for keywords.
 * @param keywords - Keywords to search for.
 * @returns True if any keyword is found, otherwise false.
 */
export function checkString(line: string, keywords: string[]): boolean {
  return keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Extracts the last line from the text and returns it with the remaining text.
 *
 * @param text - Input text to process.
 * @returns Last line and remaining text.
 */
export function getLastLine(text: string): [string, string] {
  const trimmedText = text.trimEnd();
  const index = trimmedText.lastIndexOf("\n");
  const lastLine = index === -1 ? trimmedText : trimmedText.substring(index + 1);
  const updatedText = index === -1 ? "" : trimmedText.substring(0, index);
  return [lastLine, updatedText];
}

/**
 * Searches through text line by line and returns matching results.
 *
 * @param text - Text to search through.
 * @param needed - Maximum number of results.
 * @param keywords - Optional keywords to filter results.
 * @returns Array of matching log lines.
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
 * Searches through text using an array of lines and returns matching results.
 *
 * @param text - Text to search through.
 * @param needed - Maximum number of results.
 * @param keywords - Optional keywords to filter results.
 * @returns Array of matching log lines.
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
 * Searches through log text and returns matching results.
 *
 * @param text - Text to search.
 * @param needed - Maximum number of results.
 * @param keywords - Keywords to filter results.
 * @param searchByValue - Method to use: "array" or "text".
 * @returns Array of matching log lines.
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
