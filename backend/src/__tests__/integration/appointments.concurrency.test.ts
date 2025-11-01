import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { testHelpers } from '../setup';
import { prisma } from '../../config/database';

/**
 * Concurrency Tests for Appointment API
 *
 * These tests prevent Bug #4: Race Conditions in Database Operations
 *
 * Purpose:
 * - Test concurrent appointment creation
 * - Verify database transactions prevent double bookings
 * - Test serializable isolation level
 * - Verify row-level locking works correctly
 *
 * Critical: These tests simulate real-world concurrent requests
 */

describe('Appointment Concurrency Tests', () => {
  let user: any;
  let service: any;
  let teamMember: any;
  let authToken: string;

  beforeEach(async () => {
    // Create test data
    user = await testHelpers.createTestUser({
      username: 'customer',
      email: 'customer@example.com',
    });

    const employee = await testHelpers.createTestUser({
      username: 'employee',
      email: 'employee@example.com',
      role: 'EMPLOYEE',
    });

    service = await testHelpers.createTestService({
      name: 'Test Service',
      duration: 60,
      price: 50,
    });

    teamMember = await testHelpers.createTestTeamMember(employee.id);

    authToken = await testHelpers.generateTestToken(user.id, user.role);
  });

  describe('Concurrent Booking Prevention - Bug #4 Fix', () => {
    test('prevents double booking when 2 requests hit simultaneously', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 2);

      const appointmentData = {
        serviceId: service.id,
        teamMemberId: teamMember.id,
        startTime: startTime.toISOString(),
        notes: 'Test appointment',
      };

      // Send 2 identical requests simultaneously
      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(appointmentData),
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(appointmentData),
      ]);

      // One should succeed (201), one should fail (409)
      const responses = [response1, response2];
      const successCount = responses.filter(r => r.status === 201).length;
      const conflictCount = responses.filter(r => r.status === 409).length;

      expect(successCount).toBe(1);
      expect(conflictCount).toBe(1);

      // Verify only one appointment was created in database
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: user.id,
          teamMemberId: teamMember.id,
          startTime: startTime,
        },
      });

      expect(appointments).toHaveLength(1);
    });

    test('prevents double booking when 10 requests hit simultaneously', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 3);

      const appointmentData = {
        serviceId: service.id,
        teamMemberId: teamMember.id,
        startTime: startTime.toISOString(),
        notes: 'Concurrent test',
      };

      // Send 10 identical requests simultaneously
      const promises = Array(10)
        .fill(null)
        .map(() =>
          request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${authToken}`)
            .send(appointmentData)
        );

      const responses = await Promise.all(promises);

      // Exactly one should succeed
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(1);

      // Verify only one appointment in database
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: user.id,
          teamMemberId: teamMember.id,
          startTime: startTime,
        },
      });

      expect(appointments).toHaveLength(1);
    });

    test('allows concurrent bookings for different time slots', async () => {
      const baseTime = new Date();
      baseTime.setHours(baseTime.getHours() + 4);

      // Create 5 different time slots
      const timeSlots = Array(5)
        .fill(null)
        .map((_, i) => {
          const time = new Date(baseTime);
          time.setHours(time.getHours() + i * 2); // 2 hours apart
          return time;
        });

      // Book all slots simultaneously
      const promises = timeSlots.map(time =>
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: time.toISOString(),
            notes: 'Concurrent different slots',
          })
      );

      const responses = await Promise.all(promises);

      // All should succeed since they're different time slots
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(5);

      // Verify all appointments in database
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: user.id,
          teamMemberId: teamMember.id,
        },
      });

      expect(appointments).toHaveLength(5);
    });

    test('prevents overlapping appointments', async () => {
      const startTime1 = new Date();
      startTime1.setHours(startTime1.getHours() + 5);

      const startTime2 = new Date(startTime1);
      startTime2.setMinutes(startTime2.getMinutes() + 30); // Overlaps with first

      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime1.toISOString(),
            notes: 'First appointment',
          }),
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime2.toISOString(),
            notes: 'Overlapping appointment',
          }),
      ]);

      // One succeeds, one fails
      const responses = [response1, response2];
      const successCount = responses.filter(r => r.status === 201).length;
      const conflictCount = responses.filter(r => r.status === 409).length;

      expect(successCount).toBe(1);
      expect(conflictCount).toBe(1);
    });
  });

  describe('Transaction Isolation Level', () => {
    test('uses SERIALIZABLE isolation level for appointments', async () => {
      // This test verifies the transaction configuration
      // We can't directly inspect the isolation level in the test,
      // but we can verify behavior matches SERIALIZABLE

      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 6);

      // If isolation level is correct, these should not result in phantom reads
      const promises = Array(5)
        .fill(null)
        .map(() =>
          request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              serviceId: service.id,
              teamMemberId: teamMember.id,
              startTime: startTime.toISOString(),
            })
        );

      await Promise.all(promises);

      const appointments = await prisma.appointment.findMany({
        where: { teamMemberId: teamMember.id, startTime },
      });

      // With SERIALIZABLE, exactly one should succeed
      expect(appointments).toHaveLength(1);
    });

    test('transaction prevents dirty reads', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 7);

      // Start two transactions that check availability
      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime.toISOString(),
          }),
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime.toISOString(),
          }),
      ]);

      // Second transaction should not see uncommitted data from first
      // Result: one success, one conflict
      const statuses = [response1.status, response2.status].sort();
      expect(statuses).toEqual([201, 409]);
    });
  });

  describe('Row-Level Locking', () => {
    test('FOR UPDATE lock prevents concurrent modifications', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 8);

      // These requests will compete for the same row lock
      const promises = Array(3)
        .fill(null)
        .map(() =>
          request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              serviceId: service.id,
              teamMemberId: teamMember.id,
              startTime: startTime.toISOString(),
            })
        );

      const responses = await Promise.all(promises);

      // Only one should acquire lock and succeed
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(1);
    });

    test('blocked slots are checked with row locking', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 9);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      // Create a blocked slot
      await prisma.blockedSlot.create({
        data: {
          teamMemberId: teamMember.id,
          startTime,
          endTime,
          reason: 'Lunch break',
        },
      });

      // Try to book during blocked slot
      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          serviceId: service.id,
          teamMemberId: teamMember.id,
          startTime: startTime.toISOString(),
        })
        .expect(409);

      expect(response.body.error).toContain('blocked');
    });
  });

  describe('Multiple Users Concurrent Booking', () => {
    test('different users can book same team member at different times', async () => {
      const user2 = await testHelpers.createTestUser({
        username: 'customer2',
        email: 'customer2@example.com',
      });
      const token2 = await testHelpers.generateTestToken(user2.id, user2.role);

      const time1 = new Date();
      time1.setHours(time1.getHours() + 10);

      const time2 = new Date(time1);
      time2.setHours(time2.getHours() + 2); // 2 hours later

      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: time1.toISOString(),
          }),
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${token2}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: time2.toISOString(),
          }),
      ]);

      // Both should succeed
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
    });

    test('different users cannot book same team member at same time', async () => {
      const user2 = await testHelpers.createTestUser({
        username: 'customer2',
        email: 'customer2@example.com',
      });
      const token2 = await testHelpers.generateTestToken(user2.id, user2.role);

      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 11);

      const [response1, response2] = await Promise.all([
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime.toISOString(),
          }),
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${token2}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime.toISOString(),
          }),
      ]);

      // One succeeds, one fails
      const statuses = [response1.status, response2.status].sort();
      expect(statuses).toEqual([201, 409]);
    });
  });

  describe('High Concurrency Load Test', () => {
    test('handles 50 concurrent requests without creating duplicates', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 12);

      // Simulate 50 users trying to book the same slot
      const users = await Promise.all(
        Array(50)
          .fill(null)
          .map((_, i) =>
            testHelpers.createTestUser({
              username: `loaduser${i}`,
              email: `loaduser${i}@example.com`,
            })
          )
      );

      const tokens = await Promise.all(
        users.map(u => testHelpers.generateTestToken(u.id, u.role))
      );

      const promises = tokens.map(token =>
        request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${token}`)
          .send({
            serviceId: service.id,
            teamMemberId: teamMember.id,
            startTime: startTime.toISOString(),
          })
      );

      const responses = await Promise.all(promises);

      // Exactly one should succeed
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(1);

      // Verify database
      const appointments = await prisma.appointment.findMany({
        where: { teamMemberId: teamMember.id, startTime },
      });

      expect(appointments).toHaveLength(1);
    }, 30000); // 30 second timeout for this heavy test
  });

  describe('Transaction Timeout Handling', () => {
    test('transaction completes within timeout period', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 13);

      const start = Date.now();

      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          serviceId: service.id,
          teamMemberId: teamMember.id,
          startTime: startTime.toISOString(),
        })
        .expect(201);

      const duration = Date.now() - start;

      // Should complete in less than 10 seconds (timeout is 10s)
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Concurrent Appointment Cancellation', () => {
    test('prevents race condition when cancelling', async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 14);

      // Create appointment
      const appointment = await testHelpers.createTestAppointment(
        user.id,
        service.id,
        teamMember.id,
        { startTime, status: 'CONFIRMED' }
      );

      // Try to cancel twice simultaneously
      const [response1, response2] = await Promise.all([
        request(app)
          .put(`/api/appointments/${appointment.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ status: 'CANCELLED', cancellationReason: 'Test 1' }),
        request(app)
          .put(`/api/appointments/${appointment.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ status: 'CANCELLED', cancellationReason: 'Test 2' }),
      ]);

      // Both should succeed (cancelling same appointment is idempotent)
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Verify final state
      const updated = await prisma.appointment.findUnique({
        where: { id: appointment.id },
      });

      expect(updated?.status).toBe('CANCELLED');
    });
  });
});
