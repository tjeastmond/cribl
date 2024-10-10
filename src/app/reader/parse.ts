import { ApacheParser } from "@reader/parsers/apacheParser";
import { JSONParser } from "@reader/parsers/jsonParser";

/**
 * Parses an array of log lines based on the log format.
 *
 * @param logLines - Log lines to parse.
 * @returns Parsed log records or original log lines.
 */
export function parse(logLines: string[]): Array<Record<string, any> | string> {
  if (logLines.length === 0) return [];

  const parsers = [new JSONParser(logLines), new ApacheParser(logLines)];

  for (const parser of parsers) {
    if (parser.checkFirst()) {
      return parser.parse();
    }
  }

  return logLines;
}
