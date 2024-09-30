import { BaseParser } from "./baseParser";

type JSONReturn = object | string;

export class JSONParser extends BaseParser<JSONReturn> {
  public isValid(line: string): boolean {
    try {
      JSON.parse(line);
      return true;
    } catch {
      return false;
    }
  }

  public parseLine(line: string): JSONReturn {
    if (!this.isValid(line)) return line;
    return JSON.parse(line);
  }
}
