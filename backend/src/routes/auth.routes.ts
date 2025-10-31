import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/security.middleware';
import {
  validate,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  validatePhoneNumber,
} from '../validators/auth.validator';

const router = Router();

// Apply strict rate limiting to all auth routes
router.use(authRateLimiter);

// Registration with validation
router.post(
  '/register',
  validatePhoneNumber,
  validate(registerSchema),
  authController.register
);

// Login with validation
router.post('/login', validate(loginSchema), authController.login);

// Refresh token with validation
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// Logout (requires authentication)
router.post('/logout', authenticate, authController.logout);

// Get profile (requires authentication)
router.get('/profile', authenticate, authController.getProfile);

// Update language preference (requires authentication)
router.patch('/language-preference', authenticate, authController.updateLanguagePreference);

export default router;
