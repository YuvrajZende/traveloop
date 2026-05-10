require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'traveloop_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
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
