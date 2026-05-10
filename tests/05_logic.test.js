/**
 * TEST SUITE 5: Business Logic & Utility Tests
 * Tests JWT generation, password hashing, validation logic, error handler behavior
 */

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

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Password Hashing (bcryptjs)', () => {
  test('bcrypt hashes password correctly', async () => {
    const password = 'testpassword123';
    const hash = await bcrypt.hash(password, 12);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  test('bcrypt verifies correct password', async () => {
    const password = 'testpassword123';
    const hash = await bcrypt.hash(password, 12);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
  });

  test('bcrypt rejects wrong password', async () => {
    const hash = await bcrypt.hash('correct', 12);
    const match = await bcrypt.compare('wrong', hash);
    expect(match).toBe(false);
  });
});

describe('JWT Token Generation', () => {
  const secret = 'test_secret_key_for_testing_only_12345';

  test('generates valid access token', () => {
    const userId = 'test-user-id-123';
    const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });
    expect(token).toBeDefined();
    expect(token.split('.').length).toBe(3); // header.payload.signature

    const decoded = jwt.verify(token, secret);
    expect(decoded.userId).toBe(userId);
  });

  test('generates valid refresh token with type', () => {
    const userId = 'test-user-id-123';
    const token = jwt.sign({ userId, type: 'refresh' }, secret, { expiresIn: '30d' });
    const decoded = jwt.verify(token, secret);
    expect(decoded.type).toBe('refresh');
    expect(decoded.userId).toBe(userId);
  });

  test('expired token throws TokenExpiredError', () => {
    const token = jwt.sign({ userId: 'test' }, secret, { expiresIn: '0s' });
    // Wait a tick for expiration
    expect(() => jwt.verify(token, secret)).toThrow();
  });

  test('wrong secret fails verification', () => {
    const token = jwt.sign({ userId: 'test' }, secret, { expiresIn: '7d' });
    expect(() => jwt.verify(token, 'wrong_secret')).toThrow();
  });
});

describe('Error Handler Middleware', () => {
  const { validate, errorHandler } = require('../src/middleware/errorHandler');

  test('validate is a function', () => {
    expect(typeof validate).toBe('function');
  });

  test('errorHandler is a function with 4 params (Express error middleware)', () => {
    expect(typeof errorHandler).toBe('function');
    expect(errorHandler.length).toBe(4); // (err, req, res, next) — Express requires exactly 4
  });

  test('errorHandler handles PG unique constraint error (23505)', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockReq = {};
    const mockNext = jest.fn();
    const err = new Error('duplicate key value');
    err.code = '23505';

    errorHandler(err, mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Record already exists' })
    );
  });

  test('errorHandler handles PG foreign key error (23503)', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockReq = {};
    const mockNext = jest.fn();
    const err = new Error('foreign key violation');
    err.code = '23503';

    errorHandler(err, mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Referenced record not found' })
    );
  });

  test('errorHandler handles generic error with 500', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockReq = {};
    const mockNext = jest.fn();
    const err = new Error('Something broke');

    errorHandler(err, mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Something broke' })
    );
  });

  test('errorHandler respects custom error status', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockReq = {};
    const mockNext = jest.fn();
    const err = new Error('Forbidden');
    err.status = 403;

    errorHandler(err, mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
  });
});

describe('Auth Middleware', () => {
  const { authenticate } = require('../src/middleware/auth');

  test('authenticate is an async function', () => {
    expect(typeof authenticate).toBe('function');
  });

  test('rejects request with no Authorization header', async () => {
    const mockReq = { headers: {} };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    await authenticate(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'No token provided' })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('rejects request with non-Bearer token', async () => {
    const mockReq = { headers: { authorization: 'Basic abc123' } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    await authenticate(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('rejects request with invalid JWT', async () => {
    const mockReq = { headers: { authorization: 'Bearer invalid.jwt.token' } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    await authenticate(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Invalid token' })
    );
  });
});

describe('Database Module', () => {
  test('db.query is callable', async () => {
    const { query } = require('../src/config/db');
    const result = await query('SELECT 1');
    expect(result).toBeDefined();
  });

  test('db.getClient returns a client', async () => {
    const { getClient } = require('../src/config/db');
    const client = await getClient();
    expect(client).toBeDefined();
    expect(typeof client.query).toBe('function');
    expect(typeof client.release).toBe('function');
  });
});
