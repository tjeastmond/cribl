import { isApacheLog, isCombinedApacheLog, parseLog, parseLogLines } from "@reader/parsers/apache";
import { isJSON, parseJSONArray } from "@reader/parsers/json";

export function parse(logLines: string[]) {
  if (!logLines.length) return [];

  if (isJSON(logLines[0])) {
    return parseJSONArray(logLines);
  }

  if (isApacheLog(logLines[0])) {
    return parseLogLines(logLines);
  }

  if (isCombinedApacheLog(logLines[0])) {
    return parseLog(logLines);
  }

  return logLines;
}
