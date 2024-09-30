import { ApacheParser } from "@reader/parsers/apacheParser";
import { JSONParser } from "@reader/parsers/jsonParser";

/**
 * Parses an array of log lines and returns the parsed result based on the log format.
 *
 * @param {string[]} logLines - An array of log lines to be parsed.
 * @returns {Array<object | string>} An array of parsed log records or the original log lines as strings.
 */
export function parse(logLines: string[]): Array<object | string> {
  if (!logLines.length) return [];

  const jsonParser = new JSONParser(logLines);
  const apacheParser = new ApacheParser(logLines);

  if (jsonParser.checkFirst()) return jsonParser.parse();
  if (apacheParser.checkFirst()) return apacheParser.parse();

  return logLines;
}
