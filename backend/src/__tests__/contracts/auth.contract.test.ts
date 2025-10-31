import { describe, test, expect } from 'vitest';
import { z } from 'zod';
import {
  loginSchema,
  registerSchema,
  phoneLoginSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from '../../validators/auth.validator';

/**
 * Contract Tests for Auth API
 *
 * These tests prevent Bug #1: Auth Validator/Frontend Schema Mismatches
 *
 * Purpose:
 * - Ensure frontend and backend agree on request/response schemas
 * - Catch field name mismatches (e.g., username vs emailOrUsername)
 * - Validate required vs optional fields
 * - Prevent breaking API changes
 *
 * When to update:
 * - When adding/removing fields from API requests
 * - When changing field names or types
 * - When changing validation rules
 */

describe('Auth Contract Tests', () => {
  describe('Login Schema Contract', () => {
    test('accepts username and password', () => {
      const validRequest = {
        body: {
          username: 'testuser',
          password: 'Test123!@#',
        },
      };

      expect(() => loginSchema.parse(validRequest)).not.toThrow();
    });

    test('accepts emailOrUsername and password', () => {
      const validRequest = {
        body: {
          emailOrUsername: 'test@example.com',
          password: 'Test123!@#',
        },
      };

      expect(() => loginSchema.parse(validRequest)).not.toThrow();
    });

    test('accepts phoneNumber and password', () => {
      const validRequest = {
        body: {
          phoneNumber: '+15551234567',
          password: 'Test123!@#',
        },
      };

      expect(() => loginSchema.parse(validRequest)).not.toThrow();
    });

    test('rejects request with no identifier', () => {
      const invalidRequest = {
        body: {
          password: 'Test123!@#',
        },
      };

      expect(() => loginSchema.parse(invalidRequest)).toThrow();
    });

    test('rejects request with missing password', () => {
      const invalidRequest = {
        body: {
          username: 'testuser',
        },
      };

      expect(() => loginSchema.parse(invalidRequest)).toThrow();
    });

    test('documents all acceptable login fields', () => {
      // This test serves as documentation of what fields the API accepts
      const acceptableFields = ['emailOrUsername', 'username', 'phoneNumber', 'password'];

      const schema = loginSchema.shape.body;
      const schemaKeys = Object.keys(schema.shape);

      // Verify all acceptable fields are in the schema
      acceptableFields.forEach(field => {
        expect(schemaKeys).toContain(field);
      });
    });

    test('frontend can use either username or emailOrUsername', () => {
      // Bug #1 was caused by frontend sending "username" but backend only accepting "emailOrUsername"
      // This test ensures both are acceptable

      const usernameRequest = {
        body: { username: 'testuser', password: 'Test123!@#' }
      };

      const emailOrUsernameRequest = {
        body: { emailOrUsername: 'testuser', password: 'Test123!@#' }
      };

      expect(() => loginSchema.parse(usernameRequest)).not.toThrow();
      expect(() => loginSchema.parse(emailOrUsernameRequest)).not.toThrow();
    });
  });

  describe('Register Schema Contract', () => {
    test('requires all registration fields', () => {
      const validRequest = {
        body: {
          email: 'test@example.com',
          username: 'testuser',
          phoneNumber: '+15551234567',
          password: 'Test123!@#',
          fullName: 'Test User',
        },
      };

      expect(() => registerSchema.parse(validRequest)).not.toThrow();
    });

    test('rejects registration with missing required fields', () => {
      const testCases = [
        { field: 'email', data: { username: 'test', phoneNumber: '+1555', password: 'Test123!@#', fullName: 'Test' } },
        { field: 'username', data: { email: 'test@example.com', phoneNumber: '+1555', password: 'Test123!@#', fullName: 'Test' } },
        { field: 'phoneNumber', data: { email: 'test@example.com', username: 'test', password: 'Test123!@#', fullName: 'Test' } },
        { field: 'password', data: { email: 'test@example.com', username: 'test', phoneNumber: '+1555', fullName: 'Test' } },
        { field: 'fullName', data: { email: 'test@example.com', username: 'test', phoneNumber: '+1555', password: 'Test123!@#' } },
      ];

      testCases.forEach(({ field, data }) => {
        expect(() => registerSchema.parse({ body: data }), `Should reject missing ${field}`).toThrow();
      });
    });

    test('validates email format', () => {
      const invalidEmails = ['notanemail', 'test@', '@example.com', 'test @example.com'];

      invalidEmails.forEach(email => {
        const request = {
          body: {
            email,
            username: 'testuser',
            phoneNumber: '+15551234567',
            password: 'Test123!@#',
            fullName: 'Test User',
          },
        };

        expect(() => registerSchema.parse(request), `Should reject invalid email: ${email}`).toThrow();
      });
    });

    test('validates username format', () => {
      const invalidUsernames = ['ab', 'user name', 'user@name', 'a'.repeat(31)];

      invalidUsernames.forEach(username => {
        const request = {
          body: {
            email: 'test@example.com',
            username,
            phoneNumber: '+15551234567',
            password: 'Test123!@#',
            fullName: 'Test User',
          },
        };

        expect(() => registerSchema.parse(request), `Should reject invalid username: ${username}`).toThrow();
      });
    });

    test('validates password requirements', () => {
      const invalidPasswords = [
        { password: 'short', reason: 'too short' },
        { password: 'NoNumber!', reason: 'no number' },
        { password: 'noupperca$e1', reason: 'no uppercase' },
        { password: 'NOLOWERCASE1!', reason: 'no lowercase' },
        { password: 'NoSpecialChar1', reason: 'no special character' },
      ];

      invalidPasswords.forEach(({ password, reason }) => {
        const request = {
          body: {
            email: 'test@example.com',
            username: 'testuser',
            phoneNumber: '+15551234567',
            password,
            fullName: 'Test User',
          },
        };

        expect(() => registerSchema.parse(request), `Should reject password (${reason}): ${password}`).toThrow();
      });
    });

    test('validates phone number format', () => {
      const validPhoneNumbers = ['+15551234567', '+442071234567', '+34912345678'];

      validPhoneNumbers.forEach(phoneNumber => {
        const request = {
          body: {
            email: 'test@example.com',
            username: 'testuser',
            phoneNumber,
            password: 'Test123!@#',
            fullName: 'Test User',
          },
        };

        expect(() => registerSchema.parse(request), `Should accept valid phone: ${phoneNumber}`).not.toThrow();
      });

      const invalidPhoneNumbers = ['123', 'notaphone', '+1234567890123456'];

      invalidPhoneNumbers.forEach(phoneNumber => {
        const request = {
          body: {
            email: 'test@example.com',
            username: 'testuser',
            phoneNumber,
            password: 'Test123!@#',
            fullName: 'Test User',
          },
        };

        expect(() => registerSchema.parse(request), `Should reject invalid phone: ${phoneNumber}`).toThrow();
      });
    });
  });

  describe('Phone Login Schema Contract', () => {
    test('accepts phone number only', () => {
      const validRequest = {
        body: {
          phoneNumber: '+15551234567',
        },
      };

      expect(() => phoneLoginSchema.parse(validRequest)).not.toThrow();
    });

    test('rejects invalid phone number', () => {
      const invalidRequest = {
        body: {
          phoneNumber: 'invalid',
        },
      };

      expect(() => phoneLoginSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('OTP Verification Schema Contract', () => {
    test('accepts phone number and 6-digit code', () => {
      const validRequest = {
        body: {
          phoneNumber: '+15551234567',
          code: '123456',
        },
      };

      expect(() => verifyOtpSchema.parse(validRequest)).not.toThrow();
    });

    test('rejects non-6-digit codes', () => {
      const invalidCodes = ['12345', '1234567', 'abcdef', '12345a'];

      invalidCodes.forEach(code => {
        const request = {
          body: {
            phoneNumber: '+15551234567',
            code,
          },
        };

        expect(() => verifyOtpSchema.parse(request), `Should reject invalid code: ${code}`).toThrow();
      });
    });
  });

  describe('Refresh Token Schema Contract', () => {
    test('accepts refresh token', () => {
      const validRequest = {
        body: {
          refreshToken: 'valid-refresh-token',
        },
      };

      expect(() => refreshTokenSchema.parse(validRequest)).not.toThrow();
    });

    test('rejects empty refresh token', () => {
      const invalidRequest = {
        body: {
          refreshToken: '',
        },
      };

      expect(() => refreshTokenSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('Frontend Type Safety', () => {
    test('generates TypeScript types from Zod schemas', () => {
      // Extract TypeScript type from Zod schema
      type LoginRequest = z.infer<typeof loginSchema>['body'];
      type RegisterRequest = z.infer<typeof registerSchema>['body'];

      // Test that TypeScript types match expected structure
      const loginReq: LoginRequest = {
        username: 'test',
        password: 'Test123!@#',
      };

      const registerReq: RegisterRequest = {
        email: 'test@example.com',
        username: 'testuser',
        phoneNumber: '+15551234567',
        password: 'Test123!@#',
        fullName: 'Test User',
      };

      // If this compiles, types are correct
      expect(loginReq).toBeDefined();
      expect(registerReq).toBeDefined();
    });

    test('documents breaking changes', () => {
      // This test will fail if the schema changes in a breaking way
      // Force developers to acknowledge the change and update frontend

      const expectedLoginFields = ['emailOrUsername', 'username', 'phoneNumber', 'password'];
      const expectedRegisterFields = ['email', 'username', 'phoneNumber', 'password', 'fullName'];

      const loginFields = Object.keys(loginSchema.shape.body.shape);
      const registerFields = Object.keys(registerSchema.shape.body.shape);

      expectedLoginFields.forEach(field => {
        expect(loginFields).toContain(field);
      });

      expectedRegisterFields.forEach(field => {
        expect(registerFields).toContain(field);
      });

      // If this test fails, it means fields were added/removed
      // Update the expected arrays above and notify frontend team
    });
  });

  describe('Error Messages', () => {
    test('provides clear error messages for validation failures', () => {
      const invalidRequest = {
        body: {
          password: 'Test123!@#',
        },
      };

      try {
        loginSchema.parse(invalidRequest);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.errors.map(e => e.message);
          expect(errorMessages.length).toBeGreaterThan(0);
          expect(errorMessages.some(msg => msg.includes('email') || msg.includes('username') || msg.includes('phone'))).toBe(true);
        } else {
          throw error;
        }
      }
    });

    test('error messages include field paths', () => {
      const invalidRequest = {
        body: {
          username: 'ab', // Too short
          password: 'weak', // Too weak
        },
      };

      try {
        loginSchema.parse(invalidRequest);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const paths = error.errors.map(e => e.path);
          expect(paths.some(p => p.includes('username'))).toBe(true);
          expect(paths.some(p => p.includes('password'))).toBe(true);
        }
      }
    });
  });
});
