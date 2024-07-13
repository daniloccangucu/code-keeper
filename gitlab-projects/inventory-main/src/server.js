import express from "express";
import dotenv from "dotenv";

import sequelize from "./config/database.js";
import moviesRoutes from "./routes/moviesRoutes.js";

dotenv.config();

console.log("Starting Inventory App...");

const app = express();

app.use(express.json());

app.use("/movies", moviesRoutes);

app.get("/health", (_req, res) => {
  res.status(200).send("OKAY FROM INVENTORY-APP");
});

const port = process.env.INVENTORY_PORT || 8080;

console.log("Attempting to synchronize the database...");

const withTimeout = (promise, timeout) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeout);

    promise
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

const syncWithRetry = async (retries, timeout, operationTimeout) => {
  for (let i = 0; i < retries; i++) {
    try {
      await withTimeout(sequelize.sync({ force: false }), operationTimeout);
      console.log("Database synchronization successful");
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error(
          "Unable to connect to the database after multiple attempts:",
          err
        );
        throw err;
      }
      console.log(
        `Retry ${i + 1} failed: ${err.message}. Retrying in ${timeout}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }
};

if (!process.env.PGHOST) {
  console.warn("PGHOST is undefined. Skipping database synchronization.");
  app.listen(port, () => {
    console.log(`Inventory app is running on port ${port} without database.`);
  });
} else {
  console.log("Attempting to synchronize the database...");
  syncWithRetry(500, 1000, 5000)
    .then(() => {
      app.listen(port, () => {
        console.log(`Inventory app is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("Unable to start the server:", err);
    });
}

