const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  // Fail fast: never allow the app to silently run without a real DB config.
  throw new Error('DATABASE_URL tidak ditemukan. Set variabel lingkungan terlebih dahulu.');
}

// Neon requires SSL. `sslmode=require` in the URL handles negotiation;
// rejectUnauthorized stays true so we don't downgrade certificate validation.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true, rejectUnauthorized: true },
  max: 5, // keep low: serverless functions spin up many short-lived connections
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 8_000,
});

pool.on('error', (err) => {
  // Prevents an idle client error from crashing the whole process.
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL pool error', err);
});

/**
 * Always use parameterized queries ($1, $2, ...) — never string-concatenate
 * user input into SQL. This is the primary SQL-injection defense.
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    // eslint-disable-next-line no-console
    console.warn(`Slow query (${duration}ms): ${text}`);
  }
  return result;
}

module.exports = { pool, query };
