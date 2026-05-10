const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
require('dotenv').config();

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🚀 Running database migration...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('📦 Tables created: users, refresh_tokens, places, trips, itinerary_sections, place_suggestions');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(() => process.exit(1));
