import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;
const INVENTORY_API_URL = process.env.INVENTORY_API_URL;
const GATEWAY_HOST = process.env.GATEWAY_HOST || "localhost";

app.use(bodyParser.json());

app.get("/health", (_req, res) => {
  res.status(200).send("OKAY FROM API-GATEWAY");
});

const server = app.listen(PORT, GATEWAY_HOST, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`API Gateway is accessible at http://localhost:${PORT}`);
  console.log(`The Inventory API is proxied from ${INVENTORY_API_URL}`);
});

describe("GET /health", () => {
  it("should return status 200 and a message", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.text).toBe("OKAY FROM API-GATEWAY");
  });

  afterAll(() => {
    server.close();
  });
});
