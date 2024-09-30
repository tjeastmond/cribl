import { parse } from "@reader/parse";

describe("parse function", () => {
  it("should return an empty array when logLines is empty", () => {
    expect(parse([])).toEqual([]);
  });

  it("should parse JSON lines correctly", () => {
    const jsonLines = ['{"key": "value"}'];
    expect(parse(jsonLines)).toEqual([{ key: "value" }]);
  });

  it("should parse combined Apache log lines correctly", () => {
    const apacheLogLines = [
      '233.231.88.139 - Mariane.Mayer [2024-09-19T09:50:40.023Z America/Sitka] "POST /sol-usque-conventus/corona-tendo-nihil HTTP/1.1" 502 452 - "PostmanRuntime/7.26.8"',
    ];

    expect(parse(apacheLogLines)).toEqual([
      {
        bytesSent: 452,
        clientIdentity: "-",
        clientIp: "233.231.88.139",
        dateTime: "2024-09-19T09:50:40.023Z America/Sitka",
        method: "POST",
        path: "/sol-usque-conventus/corona-tendo-nihil",
        protocol: "HTTP/1.1",
        referer: "-",
        statusCode: 502,
        user: "Mariane.Mayer",
        userAgent: "PostmanRuntime/7.26.8",
      },
    ]);
  });

  it("should return logLines when they are not JSON or Apache log", () => {
    const rawLogLines = ["This is a raw log line.", "Another raw log line."];
    expect(parse(rawLogLines)).toEqual(rawLogLines);
  });
});
