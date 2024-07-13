import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("Database Configuration:");
console.log(`PGDATABASE: ${process.env.PGDATABASE}`);
console.log(`PGUSER: ${process.env.PGUSER}`);
console.log(`PGPASSWORD: ${process.env.PGPASSWORD ? "****" : "Not Provided"}`);
console.log(`PGHOST: ${process.env.PGHOST}`);
console.log(`PGPORT: ${process.env.PGPORT}`);
console.log(`PGHOST_PRODUCTION: ${process.env.PGHOST_PRODUCTION}`);

let PGHOST;

if (process.env.PGHOST_PRODUCTION) {
  process.env.PGHOST_PRODUCTION.length > 0
    ? (PGHOST = process.env.PGHOST_PRODUCTION)
    : (PGHOST = process.env.PGHOST);
} else {
  PGHOST = process.env.PGHOST;
}

console.log(`let PGHOST: ${PGHOST}`);

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: PGHOST,
    dialect: "postgres",
    port: process.env.PGPORT,
    logging: (msg) => console.log(`Sequelize: ${msg}`),
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    if (PGHOST) {
      console.error("Unable to connect to the database:", err);
    }
  });

export default sequelize;
