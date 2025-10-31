import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { testHelpers } from '../setup';

/**
 * Integration Tests for Auth API Endpoints
 *
 * These tests prevent Bug #1: Auth Validator/Frontend Schema Mismatches
 *
 * Purpose:
 * - Test actual HTTP requests match validators
 * - Verify request/response formats
 * - Test error handling
 * - Ensure authentication flows work end-to-end
 */

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    test('successfully registers a new user with all required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          phoneNumber: '+15551234567',
          password: 'Test123!@#',
          fullName: 'New User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        email: 'newuser@example.com',
        username: 'newuser',
        fullName: 'New User',
        role: 'CUSTOMER',
      });
    });

    test('rejects registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          // Missing phoneNumber, password, fullName
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    test('rejects registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          username: 'testuser',
          phoneNumber: '+15551234567',
          password: 'Test123!@#',
          fullName: 'Test User',
        })
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors.some((e: any) => e.field.includes('email'))).toBe(true);
    });

    test('rejects registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          phoneNumber: '+15551234567',
          password: 'weak',
          fullName: 'Test User',
        })
        .expect(400);

      expect(response.body.errors.some((e: any) => e.field.includes('password'))).toBe(true);
    });

    test('rejects duplicate username', async () => {
      // Create first user
      await testHelpers.createTestUser({
        username: 'existinguser',
        email: 'existing@example.com',
      });

      // Try to register with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'different@example.com',
          username: 'existinguser',
          phoneNumber: '+15559876543',
          password: 'Test123!@#',
          fullName: 'Different User',
        })
        .expect(409);

      expect(response.body.error).toContain('already exists');
    });

    test('rejects duplicate email', async () => {
      await testHelpers.createTestUser({
        username: 'user1',
        email: 'duplicate@example.com',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          username: 'user2',
          phoneNumber: '+15559876543',
          password: 'Test123!@#',
          fullName: 'User 2',
        })
        .expect(409);

      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await testHelpers.createTestUser({
        username: 'loginuser',
        email: 'login@example.com',
        phoneNumber: '+15551234567',
      });
    });

    test('successfully logs in with username - BUG #1 FIX', async () => {
      // This is the exact scenario that caused Bug #1
      // Frontend was sending "username" but backend expected "emailOrUsername"
      // Now both should work

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('loginuser');
    });

    test('successfully logs in with emailOrUsername field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'loginuser',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.username).toBe('loginuser');
    });

    test('successfully logs in with email in emailOrUsername field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'login@example.com',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body.user.email).toBe('login@example.com');
    });

    test('successfully logs in with phoneNumber', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '+15551234567',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body.user.phoneNumber).toBe('+15551234567');
    });

    test('rejects login with no identifier', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Test123!@#',
        })
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });

    test('rejects login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('rejects login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'Test123!@#',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('returns user profile with correct fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body.user).toHaveProperty('userId');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('username');
      expect(response.body.user).toHaveProperty('fullName');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user).toHaveProperty('phoneNumber');
      expect(response.body.user).toHaveProperty('isVerified');

      // Should NOT include sensitive data
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('tokens are valid JWT format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'Test123!@#',
        })
        .expect(200);

      const { accessToken, refreshToken } = response.body;

      // JWT format: header.payload.signature
      expect(accessToken.split('.')).toHaveLength(3);
      expect(refreshToken.split('.')).toHaveLength(3);
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('successfully refreshes access token', async () => {
      // First login to get tokens
      const user = await testHelpers.createTestUser();
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!@#',
        })
        .expect(200);

      const { refreshToken } = loginResponse.body;

      // Wait a moment to ensure different token timestamps
      await testHelpers.sleep(1000);

      // Refresh the token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(refreshResponse.body).toHaveProperty('accessToken');
      expect(refreshResponse.body).toHaveProperty('refreshToken');

      // New tokens should be different from old ones
      expect(refreshResponse.body.accessToken).not.toBe(loginResponse.body.accessToken);
    });

    test('rejects invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('rejects expired refresh token', async () => {
      // Create an expired token
      const jwt = await import('jsonwebtoken');
      const expiredToken = jwt.sign(
        { userId: 'test-id', role: 'CUSTOMER' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '0s' } // Already expired
      );

      await testHelpers.sleep(1000);

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: expiredToken })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/profile', () => {
    test('returns user profile with valid token', async () => {
      const user = await testHelpers.createTestUser();
      const token = await testHelpers.generateTestToken(user.id, user.role);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        userId: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      });
    });

    test('rejects request without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('rejects request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('rejects request with expired token', async () => {
      const jwt = await import('jsonwebtoken');
      const expiredToken = jwt.sign(
        { userId: 'test-id', role: 'CUSTOMER' },
        process.env.JWT_SECRET!,
        { expiresIn: '0s' }
      );

      await testHelpers.sleep(1000);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('successfully logs out user', async () => {
      const user = await testHelpers.createTestUser();
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'Test123!@#',
        })
        .expect(200);

      const { refreshToken } = loginResponse.body;

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Try to use the refresh token - should fail
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(refreshResponse.body).toHaveProperty('error');
    });
  });

  describe('Field Name Consistency - Bug #1 Prevention', () => {
    test('all login methods work with their respective field names', async () => {
      await testHelpers.createTestUser({
        username: 'testuser',
        email: 'test@example.com',
        phoneNumber: '+15551234567',
      });

      // Test 1: username field
      const usernameResponse = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'Test123!@#' })
        .expect(200);
      expect(usernameResponse.body.user.username).toBe('testuser');

      // Test 2: emailOrUsername with username
      const emailOrUsernameResponse1 = await request(app)
        .post('/api/auth/login')
        .send({ emailOrUsername: 'testuser', password: 'Test123!@#' })
        .expect(200);
      expect(emailOrUsernameResponse1.body.user.username).toBe('testuser');

      // Test 3: emailOrUsername with email
      const emailOrUsernameResponse2 = await request(app)
        .post('/api/auth/login')
        .send({ emailOrUsername: 'test@example.com', password: 'Test123!@#' })
        .expect(200);
      expect(emailOrUsernameResponse2.body.user.email).toBe('test@example.com');

      // Test 4: phoneNumber field
      const phoneResponse = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '+15551234567', password: 'Test123!@#' })
        .expect(200);
      expect(phoneResponse.body.user.phoneNumber).toBe('+15551234567');
    });

    test('frontend can safely use username field everywhere', async () => {
      // This test documents that frontend should use "username" field
      // and backend will accept it

      await testHelpers.createTestUser({ username: 'frontenduser' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'frontenduser', // Frontend sends this
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body.user.username).toBe('frontenduser');
    });
  });
});
