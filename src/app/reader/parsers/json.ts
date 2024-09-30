/**
 * Checks if a string is valid JSON.
 *
 * @param {string} text - The string to be checked.
 * @returns {boolean} True if the string is valid JSON; otherwise, false.
 */
export function isJSON(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Parses a JSON string and returns the corresponding JavaScript object.
 * If the input string is not valid JSON, it returns the original string.
 *
 * @param {string} text - The JSON string to be parsed.
 * @returns {object | string} The parsed JavaScript object or the original string.
 */
export function parseJSON(text: string): object | string {
  if (!isJSON(text)) return text;
  return JSON.parse(text);
}

/**
 * Parses an array of JSON strings and returns an array of corresponding JavaScript objects.
 * If any string in the array is not valid JSON, it returns the original string for that element.
 *
 * @param {string[]} arrayString - The array of JSON strings to be parsed.
 * @returns {Array<object | string>} An array of parsed JavaScript objects or the original strings.
 */
export function parseJSONArray(arrayString: string[]): Array<object | string> {
  return arrayString.map(parseJSON);
}
