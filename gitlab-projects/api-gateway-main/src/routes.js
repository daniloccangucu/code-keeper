import { Router } from "express";
import { publishToRabbitMQ } from "./rabbitmq.js";

const router = Router();

router.post("/billing", async (req, res) => {
  console.log("Received POST request at /billing");
  console.log("Request body:", req.body);

  try {
    console.log("Publishing request to RabbitMQ...");
    await publishToRabbitMQ(req.body);
    console.log("Request published to RabbitMQ successfully");
    res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("Error publishing to RabbitMQ:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
