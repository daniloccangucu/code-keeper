import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("Environment variables loaded:");
console.log(`PG_2_DATABASE: ${process.env.PG_2_DATABASE}`);
console.log(`PG_2_USER: ${process.env.PG_2_USER}`);
console.log(`PG_2_PASSWORD: ${process.env.PG_2_PASSWORD}`);
console.log(`PGHOST: ${process.env.PGHOST}`);
console.log(`PGPORT: ${process.env.PGPORT}`);

let PGHOST;

if (process.env.PGHOST2_PRODUCTION) {
  console.log("if process.env.PGHOST2_PRODUCTION");
  PGHOST = process.env.PGHOST2_PRODUCTION;
} else {
  console.log("else process.env.PGHOST2_PRODUCTION");
  PGHOST = process.env.PGHOST;
}

console.log(`let PGHOST: ${PGHOST}`);

const sequelize = new Sequelize(
  process.env.PG_2_DATABASE,
  process.env.PG_2_USER,
  process.env.PG_2_PASSWORD,
  {
    host: PGHOST,
    dialect: "postgres",
    port: process.env.PGPORT,
  }
);

export default sequelize;
