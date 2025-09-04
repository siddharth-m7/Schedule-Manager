import dotenv from "dotenv";
dotenv.config();
const config = {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL,
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
//# sourceMappingURL=knexfile.js.map