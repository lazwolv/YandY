import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/**
 * Phone number validation schema
 * Validates international phone numbers
 */
const phoneNumberSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be at most 255 characters')
  .toLowerCase()
  .trim();

/**
 * Username validation schema
 */
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .trim();

/**
 * Password validation schema
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

/**
 * Full name validation schema
 */
const fullNameSchema = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must be at most 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

/**
 * OTP/Verification code schema
 */
const otpSchema = z
  .string()
  .length(6, 'Verification code must be exactly 6 digits')
  .regex(/^\d{6}$/, 'Verification code must contain only digits');

/**
 * Register validation schema
 */
export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    username: usernameSchema,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
    fullName: fullNameSchema,
  }),
});

/**
 * Login validation schema
 * Accepts emailOrUsername, username, or phoneNumber
 */
export const loginSchema = z.object({
  body: z
    .object({
      emailOrUsername: z
        .string()
        .min(3, 'Email or username is required')
        .max(255, 'Email or username is too long')
        .trim()
        .optional(),
      username: z
        .string()
        .min(3, 'Username is required')
        .max(255, 'Username is too long')
        .trim()
        .optional(),
      phoneNumber: phoneNumberSchema.optional(),
      password: z.string().min(1, 'Password is required'),
    })
    .refine(
      (data) => data.emailOrUsername || data.username || data.phoneNumber,
      { message: 'Either email, username, or phone number must be provided' }
    ),
});

/**
 * Phone login validation schema
 */
export const phoneLoginSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
  }),
});

/**
 * Verify OTP validation schema
 */
export const verifyOtpSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
    code: otpSchema,
  }),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  }),
});

/**
 * Reset password request validation schema
 */
export const resetPasswordRequestSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
  }),
});

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
  body: z.object({
    fullName: fullNameSchema.optional(),
    email: emailSchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  ),
});

/**
 * Generic validation middleware factory
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      next(error);
    }
  };
};

/**
 * Sanitize phone number (remove spaces, dashes, etc.)
 */
export const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[\s\-\(\)]/g, '');
};

/**
 * Validate and sanitize phone number middleware
 */
export const validatePhoneNumber = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body.phoneNumber) {
    req.body.phoneNumber = sanitizePhoneNumber(req.body.phoneNumber);
  }
  next();
};
