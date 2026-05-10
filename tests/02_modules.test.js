/**
 * TEST SUITE 2: Module Loading & Exports
 * Verifies all modules load without errors and export the expected interfaces
 */

// Mock pg module before any requires
jest.mock('pg', () => {
  const mockClient = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    release: jest.fn(),
  };
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn().mockResolvedValue(mockClient),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('Module Loading — Config', () => {
  test('db.js loads without error', () => {
    expect(() => require('../src/config/db')).not.toThrow();
  });

  test('db.js exports pool, query, getClient', () => {
    const db = require('../src/config/db');
    expect(db).toHaveProperty('pool');
    expect(db).toHaveProperty('query');
    expect(db).toHaveProperty('getClient');
    expect(typeof db.query).toBe('function');
    expect(typeof db.getClient).toBe('function');
  });

  test('migrate.js file is parseable', () => {
    const fs = require('fs');
    const path = require('path');
    const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'config', 'migrate.js'), 'utf8');
    expect(() => new Function(code.replace(/require\([^)]+\)/g, '({})'))).not.toThrow();
  });
});

describe('Module Loading — Middleware', () => {
  test('auth middleware loads and exports authenticate', () => {
    const auth = require('../src/middleware/auth');
    expect(auth).toHaveProperty('authenticate');
    expect(typeof auth.authenticate).toBe('function');
  });

  test('errorHandler loads and exports validate + errorHandler', () => {
    const eh = require('../src/middleware/errorHandler');
    expect(eh).toHaveProperty('validate');
    expect(eh).toHaveProperty('errorHandler');
    expect(typeof eh.validate).toBe('function');
    expect(typeof eh.errorHandler).toBe('function');
  });
});

describe('Module Loading — Routes', () => {
  test('auth routes load without error', () => {
    expect(() => require('../src/routes/auth')).not.toThrow();
  });

  test('users routes load without error', () => {
    expect(() => require('../src/routes/users')).not.toThrow();
  });

  test('trips routes load without error', () => {
    expect(() => require('../src/routes/trips')).not.toThrow();
  });

  test('places routes load without error', () => {
    expect(() => require('../src/routes/places')).not.toThrow();
  });

  test('sections routes load without error', () => {
    expect(() => require('../src/routes/sections')).not.toThrow();
  });

  test('all route modules export Express Router instances', () => {
    const authRouter = require('../src/routes/auth');
    const usersRouter = require('../src/routes/users');
    const tripsRouter = require('../src/routes/trips');
    const placesRouter = require('../src/routes/places');
    const sectionsRouter = require('../src/routes/sections');

    [authRouter, usersRouter, tripsRouter, placesRouter, sectionsRouter].forEach(router => {
      expect(typeof router).toBe('function');
      expect(router.stack).toBeDefined(); // Express Router has a stack
    });
  });
});

describe('Module Loading — App', () => {
  test('app.js loads without error and exports Express app', () => {
    // Prevent app from listening on a port
    const originalListen = require('express').application.listen;
    require('express').application.listen = jest.fn().mockReturnThis();

    const app = require('../src/app');
    expect(app).toBeDefined();
    expect(typeof app).toBe('function'); // Express app is a function
    expect(typeof app.use).toBe('function');
    expect(typeof app.get).toBe('function');

    require('express').application.listen = originalListen;
  });
});
