import express from "express";
import dotenv from "dotenv";
import { RABBITMQ_URL } from "./config/rabbitmq.js";

import { connectToRabbitMQ } from "./config/rabbitmq.js";

dotenv.config();

const app = express();
const PORT = process.env.BILLING_PORT || 8080;

app.use(express.json());

app.get("/health", (_req, res) => {
  console.log("Received health check request");
  res.status(200).send("OK FROM BILLING-APP");
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Billing API is running on port ${PORT}`);
    console.log(`Health check available at /health`);
  });
};

if (RABBITMQ_URL) {
  connectToRabbitMQ()
    .then(() => {
      console.log("Connected to RabbitMQ");
      startServer();
    })
    .catch((err) => {
      console.error(
        "Failed to connect to RabbitMQ, proceeding without it:",
        err
      );
      startServer();
    });
} else {
  console.log("RABBITMQ_URL is undefined. Skipping RabbitMQ connection.");
  startServer();
}

export { app, startServer };