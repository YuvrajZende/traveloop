/**
 * TEST SUITE 3: Route Registration & API Endpoints
 * Verifies all expected API endpoints are reachable on the Express app
 * Uses supertest to confirm routes exist (instead of internal _router inspection)
 */

// Mock pg module
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

const express = require('express');
const originalListen = express.application.listen;
express.application.listen = jest.fn().mockReturnThis();

const request = require('supertest');
const app = require('../src/app');

express.application.listen = originalListen;

// Helper: a route "exists" if it does NOT return the app's custom 404
// (our app returns 404 with message "Route ... not found" for unregistered routes)
// Registered but auth-protected routes return 401, not 404
// Registered but validation-failing routes return 422, not 404

describe('Route Registration — Auth (Screen 1 & 2)', () => {
  test('POST /api/auth/register is registered (returns 422 for empty body, not 404)', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(422); // validation error = route exists
  });

  test('POST /api/auth/login is registered (returns 422 for empty body, not 404)', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(422);
  });

  test('POST /api/auth/refresh-token is registered (returns 400, not 404)', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(400); // "Refresh token required"
  });

  test('POST /api/auth/logout is registered (returns 401, not 404)', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401); // needs auth
  });

  test('GET /api/auth/me is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });
});

describe('Route Registration — Users (Screen 2)', () => {
  test('GET /api/users/profile is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('PUT /api/users/profile is registered (returns 401, not 404)', async () => {
    const res = await request(app).put('/api/users/profile').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('POST /api/users/photo is registered (returns 401, not 404)', async () => {
    const res = await request(app).post('/api/users/photo');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });
});

describe('Route Registration — Places (Screen 3 & 4)', () => {
  test('GET /api/places is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/places');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('GET /api/places/featured is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/places/featured');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('GET /api/places/:id is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/places/some-uuid-here');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });
});

describe('Route Registration — Trips (Screen 3 & 4)', () => {
  test('GET /api/trips is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('POST /api/trips is registered (returns 401, not 404)', async () => {
    const res = await request(app).post('/api/trips').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('GET /api/trips/:id is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/trips/some-uuid');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('PUT /api/trips/:id is registered (returns 401, not 404)', async () => {
    const res = await request(app).put('/api/trips/some-uuid').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('DELETE /api/trips/:id is registered (returns 401, not 404)', async () => {
    const res = await request(app).delete('/api/trips/some-uuid');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });
});

describe('Route Registration — Sections (Screen 5)', () => {
  test('GET /api/trips/:tripId/sections is registered (returns 401, not 404)', async () => {
    const res = await request(app).get('/api/trips/some-trip/sections');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('POST /api/trips/:tripId/sections is registered (returns 401, not 404)', async () => {
    const res = await request(app).post('/api/trips/some-trip/sections').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('PUT /api/trips/:tripId/sections/:sectionId is registered (returns 401, not 404)', async () => {
    const res = await request(app).put('/api/trips/some-trip/sections/some-section').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('DELETE /api/trips/:tripId/sections/:sectionId is registered (returns 401, not 404)', async () => {
    const res = await request(app).delete('/api/trips/some-trip/sections/some-section');
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });

  test('PATCH /api/trips/:tripId/sections/reorder is registered (returns 401, not 404)', async () => {
    const res = await request(app).patch('/api/trips/some-trip/sections/reorder').send({});
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(401);
  });
});

describe('Health Check Route', () => {
  test('GET /health is registered and returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Unregistered Routes Return 404', () => {
  test('GET /api/nonexistent returns 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });

  test('POST /api/random/path returns 404', async () => {
    const res = await request(app).post('/api/random/path');
    expect(res.status).toBe(404);
  });
});
