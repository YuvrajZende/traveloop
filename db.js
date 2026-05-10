require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                   // max connections in pool
  idleTimeoutMillis: 30000,  // close idle connections after 30s
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Run a single parameterized query.
 */
const query = (text, params) => pool.query(text, params);

/**
 * Execute multiple queries inside a single transaction.
 * Automatically rolls back on error.
 *
 * Usage:
 *   const result = await db.transaction(async (client) => {
 *     const a = await client.query('INSERT ...', [...]);
 *     const b = await client.query('INSERT ...', [...]);
 *     return { a: a.rows[0], b: b.rows };
 *   });
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { query, transaction, pool };
