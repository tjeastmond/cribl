import {
  isCombinedApacheLog,
  LogRecord,
  parseApacheLogLine,
  parseLogLines,
} from "@reader/parsers/apache";

describe("Log Parsing Functions", () => {
  describe("isCombinedApacheLog", () => {
    it("should return true for valid combined Apache log entry", () => {
      // prettier-ignore
      const logLine = '127.0.0.1 - - [12/Mar/2023:14:00:00 +0000] "GET /index.html HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"';
      expect(isCombinedApacheLog(logLine)).toBe(true);
    });

    it("should return false for invalid log entry", () => {
      const logLine = "Invalid log line";
      expect(isCombinedApacheLog(logLine)).toBe(false);
    });
  });

  describe("parseApacheLogLine", () => {
    it("should parse valid combined Apache log entry", () => {
      // prettier-ignore
      const logLine = '127.0.0.1 - - [12/Mar/2023:14:00:00 +0000] "GET /index.html HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"';

      const expected: LogRecord = {
        bytesSent: 1024,
        clientIdentity: "-",
        clientIp: "127.0.0.1",
        dateTime: "12/Mar/2023:14:00:00 +0000",
        method: "GET",
        path: "/index.html",
        protocol: "HTTP/1.1",
        referer: "http://example.com",
        statusCode: 200,
        user: "-",
        userAgent: "Mozilla/5.0",
      };

      expect(parseApacheLogLine(logLine)).toEqual(expected);
    });

    it("should return the original line when not a combined Apache log", () => {
      const logLine = "Invalid log line";
      expect(parseApacheLogLine(logLine)).toBe(logLine);
    });
  });

  describe("parseLogLines", () => {
    it("should parse an array of log lines", () => {
      const logLines = [
        '127.0.0.1 - - [12/Mar/2023:14:00:00 +0000] "GET /index.html HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"',
        "Invalid log line",
      ];

      const expected = [
        {
          bytesSent: 1024,
          clientIdentity: "-",
          clientIp: "127.0.0.1",
          dateTime: "12/Mar/2023:14:00:00 +0000",
          method: "GET",
          path: "/index.html",
          protocol: "HTTP/1.1",
          referer: "http://example.com",
          statusCode: 200,
          user: "-",
          userAgent: "Mozilla/5.0",
        },
        "Invalid log line",
      ];

      expect(parseLogLines(logLines)).toEqual(expected);
    });
  });
});
