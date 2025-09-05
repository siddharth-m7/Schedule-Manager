// knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      connectionString: databaseUrl,},
    migrations: {
      directory: "./src/migrations",
      extension: "ts", // 👈 important for TS migrations
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./src/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
};

export default config;
