/**
 * TEST SUITE 4: HTTP Endpoint Tests with Supertest
 * Tests actual HTTP request/response behavior (mocked DB)
 */

// Mock pg BEFORE any app requires
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
express.application.listen = jest.fn().mockReturnThis();

const request = require('supertest');
const app = require('../src/app');

describe('Health Endpoint', () => {
  test('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.app).toBe('Traveloop API');
    expect(res.body.version).toBe('1.0.0');
  });
});

describe('404 Handler', () => {
  test('unknown route returns 404 with proper JSON', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });

  test('unknown POST route returns 404', async () => {
    const res = await request(app).post('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth — Input Validation', () => {
  test('POST /api/auth/register with missing fields returns 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  test('POST /api/auth/register with invalid email returns 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'not-an-email',
        password: '123456',
        first_name: 'Test',
        last_name: 'User',
      });
    expect(res.status).toBe(422);
    expect(res.body.errors.some(e => e.field === 'email')).toBe(true);
  });

  test('POST /api/auth/register with short password returns 422', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: '12',
        first_name: 'Test',
        last_name: 'User',
      });
    expect(res.status).toBe(422);
    expect(res.body.errors.some(e => e.field === 'password')).toBe(true);
  });

  test('POST /api/auth/login with missing fields returns 422', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login with invalid email returns 422', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bad', password: 'test123' });
    expect(res.status).toBe(422);
  });
});

describe('Auth — Protected Endpoints', () => {
  test('GET /api/auth/me without token returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('No token');
  });

  test('GET /api/auth/me with invalid token returns 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/logout without token returns 401', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(401);
  });
});

describe('Users — Protected Endpoints', () => {
  test('GET /api/users/profile without token returns 401', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
  });

  test('PUT /api/users/profile without token returns 401', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .send({ first_name: 'Updated' });
    expect(res.status).toBe(401);
  });

  test('POST /api/users/photo without token returns 401', async () => {
    const res = await request(app).post('/api/users/photo');
    expect(res.status).toBe(401);
  });
});

describe('Places — Protected Endpoints', () => {
  test('GET /api/places without token returns 401', async () => {
    const res = await request(app).get('/api/places');
    expect(res.status).toBe(401);
  });

  test('GET /api/places/featured without token returns 401', async () => {
    const res = await request(app).get('/api/places/featured');
    expect(res.status).toBe(401);
  });
});

describe('Trips — Protected Endpoints', () => {
  test('GET /api/trips without token returns 401', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).toBe(401);
  });

  test('POST /api/trips without token returns 401', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({ title: 'Test' });
    expect(res.status).toBe(401);
  });

  test('DELETE /api/trips/some-id without token returns 401', async () => {
    const res = await request(app).delete('/api/trips/some-id');
    expect(res.status).toBe(401);
  });
});

describe('Sections — Protected Endpoints', () => {
  test('GET /api/trips/some-trip/sections without token returns 401', async () => {
    const res = await request(app).get('/api/trips/some-trip/sections');
    expect(res.status).toBe(401);
  });

  test('POST /api/trips/some-trip/sections without token returns 401', async () => {
    const res = await request(app)
      .post('/api/trips/some-trip/sections')
      .send({ title: 'Test Section' });
    expect(res.status).toBe(401);
  });
});

describe('Auth — Refresh Token', () => {
  test('POST /api/auth/refresh-token without body returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Refresh token required');
  });

  test('POST /api/auth/refresh-token with invalid token returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'invalid.token.here' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid or expired');
  });
});

describe('CORS Headers', () => {
  test('responses include CORS headers', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });
});

describe('JSON Body Parsing', () => {
  test('app accepts JSON content type', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ email: 'test@test.com', password: 'test123' }));
    // Should NOT be 415 (unsupported media type)
    expect(res.status).not.toBe(415);
  });
});
