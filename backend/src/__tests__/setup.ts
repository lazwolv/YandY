import { afterAll, beforeAll, beforeEach, vi } from 'vitest';
import { prisma } from '../config/database';

/**
 * Global test setup for backend tests
 *
 * This file runs before all tests and sets up:
 * - Database connection
 * - Environment variables
 * - Global mocks
 * - Test utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.REDIS_URL = 'redis://localhost:6379';

// Mock Twilio to avoid SMS costs in tests
vi.mock('twilio', () => ({
  default: vi.fn(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        sid: 'test-message-sid',
        status: 'sent',
      }),
    },
  })),
}));

// Mock Redis for tests that don't need real Redis
vi.mock('ioredis', () => {
  const RedisMock = vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    setex: vi.fn().mockResolvedValue('OK'),
    expire: vi.fn().mockResolvedValue(1),
    ttl: vi.fn().mockResolvedValue(-1),
    quit: vi.fn().mockResolvedValue('OK'),
    disconnect: vi.fn(),
  }));
  return { default: RedisMock };
});

// Setup database before all tests
beforeAll(async () => {
  // Ensure we're using test database
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('DATABASE_URL must contain "test" for safety');
  }

  // Clean database before starting
  await cleanDatabase();
});

// Clean database between tests for isolation
beforeEach(async () => {
  await cleanDatabase();
});

// Cleanup after all tests
afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

/**
 * Clean all data from database tables
 * Maintains referential integrity by deleting in correct order
 */
async function cleanDatabase() {
  // Delete in reverse dependency order
  await prisma.feedback.deleteMany();
  await prisma.weeklyPodium.deleteMany();
  await prisma.photoVote.deleteMany();
  await prisma.workPhoto.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Global test helpers
 */
export const testHelpers = {
  /**
   * Create a test user
   */
  async createTestUser(overrides = {}) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('Test123!@#', 10);

    return prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        phoneNumber: '+15551234567',
        password: hashedPassword,
        fullName: 'Test User',
        role: 'CUSTOMER',
        isVerified: true,
        ...overrides,
      },
    });
  },

  /**
   * Create a test service
   */
  async createTestService(overrides = {}) {
    return prisma.service.create({
      data: {
        name: 'Test Service',
        description: 'Test service description',
        price: 50.00,
        duration: 60,
        category: 'MANICURE',
        isActive: true,
        ...overrides,
      },
    });
  },

  /**
   * Create a test team member
   */
  async createTestTeamMember(userId: string, overrides = {}) {
    return prisma.teamMember.create({
      data: {
        userId,
        specialty: 'Nail Art',
        bio: 'Test bio',
        isActive: true,
        ...overrides,
      },
    });
  },

  /**
   * Create a test appointment
   */
  async createTestAppointment(
    userId: string,
    serviceId: string,
    teamMemberId: string,
    overrides = {}
  ) {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 2); // 2 hours from now

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1); // 1 hour duration

    return prisma.appointment.create({
      data: {
        userId,
        serviceId,
        teamMemberId,
        startTime,
        endTime,
        status: 'PENDING',
        ...overrides,
      },
    });
  },

  /**
   * Generate JWT token for testing
   */
  async generateTestToken(userId: string, role: string = 'CUSTOMER') {
    const jwt = await import('jsonwebtoken');
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  },

  /**
   * Sleep helper for timing tests
   */
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};
