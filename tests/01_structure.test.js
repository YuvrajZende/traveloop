/**
 * TEST SUITE 1: Project Structure & File Integrity
 * Verifies all required files exist and have proper exports
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

describe('Project Structure', () => {
  const requiredFiles = [
    'package.json',
    '.env.example',
    'README.md',
    'src/app.js',
    'src/config/db.js',
    'src/config/migrate.js',
    'src/config/schema.sql',
    'src/middleware/auth.js',
    'src/middleware/errorHandler.js',
    'src/routes/auth.js',
    'src/routes/places.js',
    'src/routes/sections.js',
    'src/routes/trips.js',
    'src/routes/users.js',
  ];

  test.each(requiredFiles)('File exists: %s', (file) => {
    const filePath = path.join(ROOT, file);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('uploads directory exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'uploads'))).toBe(true);
  });

  test('uploads directory is a directory', () => {
    expect(fs.statSync(path.join(ROOT, 'uploads')).isDirectory()).toBe(true);
  });
});

describe('Package.json Integrity', () => {
  let pkg;

  beforeAll(() => {
    pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  });

  test('has correct name', () => {
    expect(pkg.name).toBe('traveloop-backend');
  });

  test('main entry is src/app.js', () => {
    expect(pkg.main).toBe('src/app.js');
  });

  test('has start script', () => {
    expect(pkg.scripts.start).toBe('node src/app.js');
  });

  test('has dev script', () => {
    expect(pkg.scripts.dev).toBe('nodemon src/app.js');
  });

  test('has migrate script', () => {
    expect(pkg.scripts.migrate).toBe('node src/config/migrate.js');
  });

  const requiredDeps = ['express', 'pg', 'bcryptjs', 'jsonwebtoken', 'cors', 'dotenv', 'multer', 'express-validator'];
  test.each(requiredDeps)('dependency installed: %s', (dep) => {
    expect(pkg.dependencies).toHaveProperty(dep);
  });
});

describe('Schema SQL Integrity', () => {
  let schema;

  beforeAll(() => {
    schema = fs.readFileSync(path.join(SRC, 'config', 'schema.sql'), 'utf8');
  });

  const requiredTables = ['users', 'refresh_tokens', 'places', 'trips', 'itinerary_sections', 'place_suggestions'];
  test.each(requiredTables)('schema contains CREATE TABLE for: %s', (table) => {
    expect(schema).toMatch(new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`, 'i'));
  });

  test('schema enables uuid-ossp extension', () => {
    expect(schema).toContain('uuid-ossp');
  });

  test('schema has updated_at trigger function', () => {
    expect(schema).toContain('update_updated_at_column');
  });

  test('schema has seed data for places', () => {
    expect(schema).toContain('INSERT INTO places');
    expect(schema).toContain('Eiffel Tower');
  });

  test('users table has all required columns', () => {
    const userSection = schema.substring(schema.indexOf('CREATE TABLE IF NOT EXISTS users'), schema.indexOf('CREATE TABLE IF NOT EXISTS refresh_tokens'));
    ['email', 'password_hash', 'first_name', 'last_name', 'phone', 'city', 'country', 'photo_url', 'bio', 'is_active'].forEach(col => {
      expect(userSection).toContain(col);
    });
  });

  test('trips table has status CHECK constraint', () => {
    expect(schema).toMatch(/CHECK\s*\(status\s+IN\s*\(/i);
    expect(schema).toContain('upcoming');
    expect(schema).toContain('ongoing');
    expect(schema).toContain('completed');
    expect(schema).toContain('cancelled');
  });

  test('itinerary_sections table has type CHECK constraint', () => {
    expect(schema).toMatch(/CHECK\s*\(type\s+IN\s*\(/i);
    expect(schema).toContain("'travel'");
    expect(schema).toContain("'hotel'");
    expect(schema).toContain("'activity'");
    expect(schema).toContain("'food'");
    expect(schema).toContain("'general'");
  });

  test('schema has proper indexes', () => {
    expect(schema).toContain('idx_users_email');
    expect(schema).toContain('idx_trips_user');
    expect(schema).toContain('idx_places_country');
    expect(schema).toContain('idx_sections_trip');
  });
});

describe('Environment Example', () => {
  let envExample;

  beforeAll(() => {
    envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');
  });

  const requiredVars = ['PORT', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET', 'JWT_EXPIRES_IN'];
  test.each(requiredVars)('.env.example contains: %s', (varName) => {
    expect(envExample).toContain(varName);
  });
});
