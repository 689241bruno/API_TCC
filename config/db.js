const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável de ambiente DATABASE_URL não está configurada.");
}

const pool = new Pool({
  connectionString: connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
