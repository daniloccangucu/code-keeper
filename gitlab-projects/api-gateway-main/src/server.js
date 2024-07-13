import express from "express";
import pkg from "body-parser";
import routes from "./routes.js";
import dotenv from "dotenv";
import proxy from "./proxy.js";

import { INVENTORY_API_URL } from "./proxy.js";

dotenv.config();

const { json } = pkg;

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;
const GATEWAY_HOST = process.env.GATEWAY_HOST || "::";

console.log(`GATEWAY_PORT: ${PORT}`);
console.log(`INVENTORY_API_URL: ${INVENTORY_API_URL}`);
console.log(`GATEWAY_HOST: ${GATEWAY_HOST}`);

app.use(json());

app.use(
  "/api/movies",
  (req, _res, next) => {
    console.log(`Proxying request: ${req.method} ${req.originalUrl}`);
    next();
  },
  proxy
);

app.use(
  "/api",
  (req, _res, next) => {
    console.log(`Routing request: ${req.method} ${req.originalUrl}`);
    next();
  },
  routes
);

app.get("/health", (_req, res) => {
  res.status(200).send("OKAY FROM API-GATEWAY");
});

app.listen(PORT, GATEWAY_HOST, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`The Inventory API is proxied from ${INVENTORY_API_URL}`);
});
