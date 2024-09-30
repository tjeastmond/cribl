import {
  isApacheLog,
  isCombinedApacheLog,
  parseApacheLog,
  parseApacheLogLines,
} from "@reader/parsers/apache";
import { isJSON, parseJSONArray } from "@reader/parsers/json";

/**
 * Parses an array of log lines and returns the parsed result based on the log format.
 *
 * @param {string[]} logLines - An array of log lines to be parsed.
 * @returns {Array<object | string>} An array of parsed log records or the original log lines as strings.
 */
export function parse(logLines: string[]): Array<object | string> {
  if (!logLines.length) return [];
  if (isJSON(logLines[0])) return parseJSONArray(logLines);
  if (isApacheLog(logLines[0])) return parseApacheLogLines(logLines);
  if (isCombinedApacheLog(logLines[0])) return parseApacheLog(logLines);
  return logLines;
}
