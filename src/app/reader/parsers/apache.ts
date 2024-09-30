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

/**
 * Checks if a given log line matches the Apache log format.
 *
 * @param line - A single log line in string format.
 * @returns True if the log line matches the Apache log format, otherwise false.
 */
export function isApacheLog(line: string): boolean {
  const apacheLogRegex = /^(\S+)\s(\S+)\s(\S+)\s(.+)\s(".+")\s(\d{3})\s(\d+)$/gi;
  return apacheLogRegex.test(line);
}

/**
 * Checks if a given log line matches the Combined Apache log format.
 *
 * @param line - A single log line in string format.
 * @returns True if the log line matches the Combined Apache log format, otherwise false.
 */
export function isCombinedApacheLog(line: string): boolean {
  const combinedRegex = /^(\S+)\s(\S+)\s(\S+)\s(\[\S+.+])\s(".+")\s(\d{3})\s(\d+)\s(\S+)\s"(.+?)"$/;
  return combinedRegex.test(line);
}

/**
 * Parses a single Apache log line into a structured LogRecord object.
 * If the log line does not match the Combined Apache log format, it will be returned as a string.
 *
 * @param {string} logLine - A single log line in string format.
 * @returns {LogRecord | string} A LogRecord object or the original log line as a string.
 */
export function parseApacheLogLine(logLine: string): LogRecord | string {
  if (!isCombinedApacheLog(logLine)) return logLine;

  const parts = logLine.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
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

/**
 * Parses an array of Apache log lines into structured LogRecord objects.
 * If a log line does not match the Combined Apache log format, it will be returned as a string.
 *
 * @param {string[]} logLines - An array of log lines in string format.
 * @returns {Array<LogRecord | string>} An array of LogRecord or the original log lines as strings.
 */
export function parseApacheLogLines(logLines: string[]): Array<LogRecord | string> {
  return logLines.map(parseApacheLogLine);
}

/**
 * Parses an array of log lines into structured LogRecord objects.
 * If a log line does not match the Apache log format, it will be returned as a string.
 *
 * @param logLines - An array of log lines in string format.
 * @returns An array of LogRecord objects or the original log lines as strings.
 */
export function parseApacheLog(logLines: string[]): Array<LogRecord | string> {
  return parseApacheLogLines(logLines);
}
