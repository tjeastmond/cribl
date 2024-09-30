import { BaseParser } from "./baseParser";

export type ApacheLine = LogRecord | string;

export interface LogRecord {
  clientIp: string;
  clientIdentity: string;
  user: string;
  dateTime: string;
  method: string;
  path: string;
  protocol: string;
  statusCode: number;
  bytesSent: number;
  referer: string;
  userAgent: string;
}

const apacheLogRegex = /^(\S+)\s(\S+)\s(\S+)\s(.+)\s(".+")\s(\d{3})\s(\d+)$/gi;
const combinedRegex = /^(\S+)\s(\S+)\s(\S+)\s(\[\S+.+])\s(".+")\s(\d{3})\s(\d+)\s(\S+)\s"(.+?)"$/;

export class ApacheParser extends BaseParser<ApacheLine> {
  public isValid(line: string): boolean {
    return apacheLogRegex.test(line) || combinedRegex.test(line);
  }

  public parseLine(line: string): ApacheLine {
    if (!this.isValid(line)) return line;

    const parts = line.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    const clientIp = parts[0] as string;
    const clientIdentity = parts[1];
    const user = parts[2];
    const dateTime = parts[3].replace("[", "") + " " + parts[4].replace("]", "");
    const request = parts[5].replace(/"/g, "");
    const [method, path, protocol] = request.split(" ");
    const statusCode = parseInt(parts[6], 10);
    const bytesSent = parts[7] === "-" ? 0 : parseInt(parts[7], 10);
    const referer = parts[8].replace(/"/g, "");
    const userAgent = parts[9].replace(/"/g, "");

    return {
      clientIp,
      clientIdentity,
      user,
      dateTime,
      method,
      path,
      protocol,
      statusCode,
      bytesSent,
      referer,
      userAgent,
    };
  }
}
