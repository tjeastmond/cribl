import { readLogFile } from "@reader/main";
import readerHandler from "@routes/readerHandler";
import express from "express";
import request from "supertest";

jest.mock("@reader/main"); // Mocking the readLogFile function

const app = express();
app.use(express.json());
app.post("/read-log", readerHandler);

describe("readerHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if fileName is missing", async () => {
    const response = await request(app).post("/read-log").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing a valid file name");
  });

  it("should return log entries with correct parameters", async () => {
    const mockResults = [{ message: "Log entry 1" }, { message: "Log entry 2" }];
    (readLogFile as jest.Mock).mockResolvedValue(mockResults);

    const response = await request(app)
      .post("/read-log")
      .send({ file_name: "test.log", keywords: ["error"], num_results: 10 });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(mockResults.length);
    expect(response.body.keywords).toEqual(["error"]);
    expect(response.body.data).toEqual(mockResults);
    expect(readLogFile).toHaveBeenCalledWith("test.log", 10, ["error"]);
  });

  it("should default to 100 results if num_results is not provided", async () => {
    const mockResults = [{ message: "Log entry 1" }, { message: "Log entry 2" }];
    (readLogFile as jest.Mock).mockResolvedValue(mockResults);

    const response = await request(app)
      .post("/read-log")
      .send({ file_name: "test.log", keywords: ["info"] });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(mockResults.length);
    expect(response.body.keywords).toEqual(["info"]);
    expect(readLogFile).toHaveBeenCalledWith("test.log", 100, ["info"]);
  });
});
