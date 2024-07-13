import amqp from "amqplib";
import { createOrder } from "../controllers/OrderController.js";

let channel;
const MAX_RETRIES = 100; // Maximum number of retries
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

export let RABBITMQ_URL;

if (process.env.RABBITMQ_URL_PRODUCTION) {
  console.log("if RABBITMQ_URL_PRODUCTION");
  RABBITMQ_URL = process.env.RABBITMQ_URL_PRODUCTION;
} else {
  console.log("else RABBITMQ_URL_PRODUCTION");
  RABBITMQ_URL = process.env.RABBITMQ_URL;
}

console.log(`let RABBITMQ_URL: ${RABBITMQ_URL}`);

export async function connectToRabbitMQ(retries = 0) {
  try {
    console.log("Attempting to connect to RabbitMQ...");
    console.log("RabbitMQ URL:", RABBITMQ_URL);

    const connection = await amqp.connect(RABBITMQ_URL);
    console.log("Connected to RabbitMQ");

    channel = await connection.createChannel();
    console.log("Channel created");

    const queue = process.env.RABBITMQ_QUEUE;
    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });
    console.log(`Queue ${queue} asserted`);

    channel.consume(
      queue,
      async (msg) => {
        try {
          const orderData = JSON.parse(msg.content.toString());
          console.log("Received message:", orderData);
          await createOrderWithRetry(orderData);
          channel.ack(msg);
          console.log("Order processed:", orderData);
        } catch (error) {
          console.error("Error processing order:", error);
          channel.reject(msg, false);
        }
      },
      { noAck: false }
    );
    console.log(`Started consuming messages from queue: ${queue}`);
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    if (retries < MAX_RETRIES) {
      console.log(
        `Retrying to connect to RabbitMQ (${retries + 1}/${MAX_RETRIES})...`
      );
      setTimeout(() => connectToRabbitMQ(retries + 1), RETRY_DELAY);
    } else {
      console.error(
        "Exceeded maximum retry attempts. Could not connect to RabbitMQ."
      );
    }
  }
}

async function createOrderWithRetry(orderData, retries = 0) {
  try {
    await createOrder(orderData);
  } catch (error) {
    console.error("Error creating order:", error);
    if (retries < MAX_RETRIES) {
      console.log(
        `Retrying to create order (${retries + 1}/${MAX_RETRIES})...`
      );
      setTimeout(
        () => createOrderWithRetry(orderData, retries + 1),
        RETRY_DELAY
      );
    } else {
      console.error("Exceeded maximum retry attempts. Could not create order.");
    }
  }
}
