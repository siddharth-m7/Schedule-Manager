import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();


const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: databaseUrl,
    migrations: {
      directory: "./src/migrations",
      extension: "cjs", // because migrations are CommonJS
    },
    seeds: {
      directory: "./src/seeds",
    },
  },
};

export default config;
