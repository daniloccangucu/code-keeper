import { connect } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let RABBITMQ_URL_RAW;

if (process.env.RABBITMQ_URL_PRODUCTION) {
  console.log("if process.env.RABBITMQ_URL_PRODUCTION");
  RABBITMQ_URL_RAW = process.env.RABBITMQ_URL_PRODUCTION;
} else {
  console.log("else process.env.RABBITMQ_URL_PRODUCTION");
  RABBITMQ_URL_RAW = process.env.RABBITMQ_URL;
}

console.log(`let RABBITMQ_URL_RAW: ${RABBITMQ_URL_RAW}`);

const QUEUE_NAME = process.env.RABBITMQ_QUEUE;
export const RABBITMQ_URL = RABBITMQ_URL_RAW;
const MAX_RETRIES = 100;
const RETRY_DELAY = 1000; // 1 second

export async function publishToRabbitMQ(message) {
  console.log("Publishing message to RabbitMQ...");
  console.log("RabbitMQ URL:", RABBITMQ_URL);
  console.log("Queue Name:", QUEUE_NAME);
  console.log("Message:", message);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    try {
      console.log(`Attempt ${attempt} to connect to RabbitMQ...`);
      const connection = await Promise.race([
        connect(RABBITMQ_URL),
        timeoutPromise,
      ]);
      console.log("Connected to RabbitMQ");

      const channel = await connection.createChannel();
      console.log("Channel created");

      await channel.assertQueue(QUEUE_NAME);
      console.log(`Queue ${QUEUE_NAME} asserted`);

      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
      console.log("Message published to RabbitMQ:", message);

      await channel.close();
      console.log("Channel closed");

      await connection.close();
      console.log("Connection closed");
      break;
    } catch (error) {
      console.error("Error publishing message to RabbitMQ:", error);

      if (attempt === MAX_RETRIES) {
        console.error("Max retries reached. Failed to connect to RabbitMQ.");
        throw error;
      }

      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}
