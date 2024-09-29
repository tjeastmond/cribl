import { asyncHandler, errorHandler, notFoundHandler } from "@routes/serverHandlers";
import express, { Request, Response } from "express";
import request from "supertest";

const app = express();

app.get("/throw", () => {
  throw new Error("This is an error!");
});

app.get(
  "/test-async",
  asyncHandler(async (_: Request, res: Response) => {
    res.status(200).send("Success");
  }),
);

app.get(
  "/test-async-error",
  asyncHandler(async (_req: Request, _res: Response) => {
    throw new Error("Test error");
  }),
);

app.use(notFoundHandler);
app.use(errorHandler);

describe("Server Handlers", () => {
  console.error = jest.fn();

  it("notFoundHandler: should respond with 404 JSON error", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.status).toBe(404);
    expect(response.headers["content-type"].match(/json/));
    expect(response.body).toEqual({ error: "Not Found" });
  });

  it("errorHandler: should respond with 500 TEXT error", async () => {
    const response = await request(app).get("/throw");
    expect(response.status).toBe(500);
    expect(response.headers["content-type"].match(/text/));
    expect(response.text).toEqual("Internal Server Error");
  });
});

describe("Async Handler", () => {
  it("should handle successful async route", async () => {
    const response = await request(app).get("/test-async");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Success");
  });

  it("should handle errors in async route", async () => {
    const response = await request(app).get("/test-async-error");
    expect(response.status).toBe(500);
  });
});
