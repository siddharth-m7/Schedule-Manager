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
      extension: "cjs",
    },
    seeds: {
      directory: "./src/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }, // required for Render
    },
    migrations: {
      directory: "./src/migrations",
      extension: "cjs",
    },
    seeds: {
      directory: "./src/seeds",
    },
  },
};

export default config;
