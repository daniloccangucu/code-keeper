import request from "supertest";
import express from "express";

const app = express();
app.get("/health", (_req, res) => {
  res.status(200).send("OK FROM API-GATEWAY");
});

describe("Unit Test: /health endpoint", () => {
  it("should return 200 and OK FROM API-GATEWAY", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("OK FROM API-GATEWAY");
  });
});
