import knex from "knex";
import knexConfig from "../../knexfile.js";

// Type assertion to allow dynamic environment key access
const configObj = knexConfig as Record<string, any>;

const environment = process.env.NODE_ENV || "development";
const config = configObj[environment] || configObj["development"];
if (!config) {
	throw new Error(`Knex configuration for environment '${environment}' not found.`);
}
const db = knex(config);

export default db;
