import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { normalizePhoneNumber } from '../utils/phone';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, phoneNumber, password, fullName } = req.body;

    // Validation
    if (!email || !username || !phoneNumber || !password || !fullName) {
      throw new AppError('All fields are required', 400);
    }

    // Normalize phone number to E.164 format
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }, { phoneNumber: normalizedPhone }],
      },
    });

    if (existingUser) {
      throw new AppError('User with this email, username, or phone already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        phoneNumber: normalizedPhone,
        passwordHash,
        fullName,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, emailOrUsername, password } = req.body;
    const loginIdentifier = emailOrUsername || username;

    if (!loginIdentifier || !password) {
      throw new AppError('Username and password are required', 400);
    }

    // Normalize phone number if it looks like a phone (contains digits)
    const normalizedIdentifier = /\d/.test(loginIdentifier)
      ? normalizePhoneNumber(loginIdentifier)
      : loginIdentifier;

    // Find user by username, email, or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: loginIdentifier },
          { email: loginIdentifier },
          { phoneNumber: normalizedIdentifier },
        ],
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        points: user.points,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Login failed', 500);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token (throws error if invalid)
    verifyRefreshToken(refreshToken);

    // Check if token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // Store new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt,
      },
    });

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Token refresh failed', 401);
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    throw new AppError('Logout failed', 500);
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        username: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        points: true,
        languagePreference: true,
        createdAt: true,
        teamMember: {
          select: {
            id: true,
            specialty: true,
            bio: true,
            isAvailable: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch profile', 500);
  }
};

export const updateLanguagePreference = async (req: AuthRequest, res: Response) => {
  try {
    const { languagePreference } = req.body;

    if (!languagePreference || !['en', 'es'].includes(languagePreference)) {
      throw new AppError('Invalid language preference. Must be "en" or "es"', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { languagePreference },
      select: {
        id: true,
        email: true,
        username: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        points: true,
        languagePreference: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Language preference updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update language preference', 500);
  }
};
