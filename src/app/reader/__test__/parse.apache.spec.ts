import { ApacheParser, LogRecord } from "@reader/parsers/apacheParser";

describe("Apache Log Parsing", () => {
  const combined = [
    '127.0.0.1 - - [12/Mar/2023:14:00:00 +0000] "GET /index.html HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"',
  ];

  const standard = [
    '127.0.0.1 - - [12/Mar/2023:14:00:00 +0000] "GET /index.html HTTP/1.1" 200 1024',
  ];

  let parser: ApacheParser;
  let parser2: ApacheParser;

  beforeEach(() => {
    parser = new ApacheParser(combined);
    parser2 = new ApacheParser(standard);
  });

  describe("isValid", () => {
    it("should return true for valid Apache log entries", () => {
      expect(parser.checkFirst()).toBe(true);
      expect(parser2.checkFirst()).toBe(true);
    });

    it("should return false for an invalid log entry", () => {
      const logLine = "Invalid log line";
      expect(parser.isValid(logLine)).toBe(false);
      expect(parser2.isValid(logLine)).toBe(false);
    });
  });

  describe("parse Apache Log Lines", () => {
    it("should parse valid combined Apache log entry", () => {
      const logLine = parser.buffer[0];

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

      expect(parser.parseLine(logLine)).toEqual(expected);
    });

    it("should return the original line when not a combined Apache log", () => {
      const logLine = "Invalid log line";
      expect(parser.parseLine(logLine)).toBe(logLine);
      expect(parser2.parseLine(logLine)).toBe(logLine);
    });
  });

  describe("parseApacheLogLines", () => {
    it("should parse an array of log lines", () => {
      const logLines = [
        '127.0.0.1 - - [12/Mar/2023:14:00:00 +0000] "GET /index.html HTTP/1.1" 200 1024 "http://example.com" "Mozilla/5.0"',
        "Invalid log line",
      ];

      const parser3 = new ApacheParser(logLines);

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

      expect(parser3.parse()).toEqual(expected);
    });
  });
});
