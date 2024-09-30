import { isJSON, parseJSONArray } from "./json";
import { isApacheLog, isCombinedApacheLog, parseLog, parseLogLines } from "./apache";

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
