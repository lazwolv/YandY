import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

// Create a new appointment
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      serviceId,
      teamMemberId,
      startTime,
      notes,
      isRecurring,
      recurringPattern,
      recurringEndDate,
    } = req.body;

    const userId = req.user?.userId;

    // Validate required fields
    if (!serviceId || !teamMemberId || !startTime) {
      throw new AppError('Service, team member, and start time are required', 400);
    }

    const appointmentStartTime = new Date(startTime);

    // Use serializable transaction to prevent race conditions
    // This ensures that concurrent requests don't see the same "available" slot
    const appointment = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Fetch service details within transaction
        const service = await tx.service.findUnique({ where: { id: serviceId } });

        if (!service) {
          throw new AppError('Service not found', 404);
        }

        // Calculate end time based on service duration
        const appointmentEndTime = new Date(appointmentStartTime.getTime() + service.duration * 60000);

        // Check for appointment conflicts
        const conflictingAppointments = await tx.appointment.findMany({
          where: {
            teamMemberId: teamMemberId,
            status: {
              notIn: ['CANCELLED', 'NO_SHOW']
            },
            OR: [
              {
                AND: [
                  { startTime: { lte: appointmentStartTime } },
                  { endTime: { gt: appointmentStartTime } }
                ]
              },
              {
                AND: [
                  { startTime: { lt: appointmentEndTime } },
                  { endTime: { gte: appointmentEndTime } }
                ]
              },
              {
                AND: [
                  { startTime: { gte: appointmentStartTime } },
                  { endTime: { lte: appointmentEndTime } }
                ]
              }
            ]
          },
          select: { id: true }
        });

        if (conflictingAppointments.length > 0) {
          throw new AppError('This time slot is not available', 409);
        }

        // Check for blocked slots that might conflict
        const blockedSlots = await tx.blockedSlot.findMany({
          where: {
            teamMemberId: teamMemberId,
            OR: [
              {
                AND: [
                  { startTime: { lte: appointmentStartTime } },
                  { endTime: { gt: appointmentStartTime } }
                ]
              },
              {
                AND: [
                  { startTime: { lt: appointmentEndTime } },
                  { endTime: { gte: appointmentEndTime } }
                ]
              },
              {
                AND: [
                  { startTime: { gte: appointmentStartTime } },
                  { endTime: { lte: appointmentEndTime } }
                ]
              }
            ]
          },
          select: { id: true }
        });

        if (blockedSlots.length > 0) {
          throw new AppError('This time slot is blocked and not available', 409);
        }

        // Create the appointment within the transaction
        const newAppointment = await tx.appointment.create({
          data: {
            userId: userId as string,
            serviceId,
            teamMemberId,
            startTime: appointmentStartTime,
            endTime: appointmentEndTime,
            status: 'PENDING',
            notes: notes || null,
          },
          include: {
            service: true,
            teamMember: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    username: true,
                  },
                },
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        });

        return newAppointment;
      },
      {
        isolationLevel: 'Serializable', // Highest isolation level to prevent phantom reads
        timeout: 10000, // 10 second timeout for transaction
      }
    );

    // Handle recurring appointments outside the main transaction
    // This prevents holding locks for too long
    if (isRecurring && recurringPattern && recurringEndDate) {
      await createRecurringAppointments(
        userId as string,
        serviceId,
        teamMemberId,
        appointmentStartTime,
        recurringPattern,
        new Date(recurringEndDate),
        notes,
        appointment.service.duration
      );
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    throw error;
  }
};

// Helper function to create recurring appointments
async function createRecurringAppointments(
  userId: string,
  serviceId: string,
  teamMemberId: string,
  startDate: Date,
  pattern: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
  endDate: Date,
  notes: string | null,
  serviceDuration: number
) {
  let currentDate = new Date(startDate);

  // Determine interval based on pattern
  const intervalDays = pattern === 'WEEKLY' ? 7 : pattern === 'BIWEEKLY' ? 14 : 30;

  while (currentDate <= endDate) {
    currentDate = new Date(currentDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    if (currentDate > endDate) break;

    const currentEndTime = new Date(currentDate.getTime() + serviceDuration * 60000);

    // Use transaction for each recurring appointment to prevent race conditions
    try {
      await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          // Check availability
          const conflictingAppointments = await tx.appointment.findMany({
            where: {
              teamMemberId: teamMemberId,
              status: {
                notIn: ['CANCELLED', 'NO_SHOW']
              },
              OR: [
                {
                  AND: [
                    { startTime: { lte: currentDate } },
                    { endTime: { gt: currentDate } }
                  ]
                },
                {
                  AND: [
                    { startTime: { lt: currentEndTime } },
                    { endTime: { gte: currentEndTime } }
                  ]
                },
                {
                  AND: [
                    { startTime: { gte: currentDate } },
                    { endTime: { lte: currentEndTime } }
                  ]
                }
              ]
            },
            select: { id: true }
          });

          if (conflictingAppointments.length === 0) {
            // Create appointment if slot is available
            await tx.appointment.create({
              data: {
                userId,
                serviceId,
                teamMemberId,
                startTime: currentDate,
                endTime: currentEndTime,
                status: 'PENDING',
                notes,
              },
            });
          }
        },
        {
          isolationLevel: 'Serializable',
          timeout: 10000,
        }
      );
    } catch (error) {
      // Log error but continue with other recurring appointments
      console.error(`Failed to create recurring appointment for ${currentDate}:`, error);
    }
  }
}

// Get user's appointments
export const getUserAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { upcoming } = req.query;

    const where: any = { userId };

    if (upcoming === 'true') {
      where.startTime = { gte: new Date() };
      where.status = { notIn: ['CANCELLED', 'COMPLETED'] };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        teamMember: {
          include: {
            user: {
              select: {
                fullName: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json({ appointments });
  } catch (error) {
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        cancellationReason: cancellationReason || null,
      },
      include: {
        service: true,
        teamMember: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    throw error;
  }
};

// Get employee's upcoming appointments
export const getEmployeeAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get the team member record for this user
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId },
    });

    if (!teamMember) {
      throw new AppError('Team member profile not found', 404);
    }

    const { date, upcoming } = req.query;

    let where: any = {
      teamMemberId: teamMember.id,
    };

    if (date) {
      const selectedDate = new Date(date as string);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      where.startTime = {
        gte: startOfDay,
        lt: endOfDay,
      };
    } else if (upcoming === 'true') {
      where.startTime = { gte: new Date() };
      where.status = { notIn: ['CANCELLED', 'COMPLETED', 'NO_SHOW'] };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        user: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json({ appointments });
  } catch (error) {
    throw error;
  }
};

// Get employee dashboard stats
export const getEmployeeDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get the team member record for this user
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!teamMember) {
      throw new AppError('Team member profile not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get today's appointments
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        teamMemberId: teamMember.id,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
      include: {
        service: true,
        user: {
          select: {
            fullName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Get upcoming appointments (next 7 days)
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        teamMemberId: teamMember.id,
        startTime: {
          gte: tomorrow,
          lt: nextWeek,
        },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
      include: {
        service: true,
        user: {
          select: {
            fullName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Get statistics
    const totalCompleted = await prisma.appointment.count({
      where: {
        teamMemberId: teamMember.id,
        status: 'COMPLETED',
      },
    });

    const thisMonthCompleted = await prisma.appointment.count({
      where: {
        teamMemberId: teamMember.id,
        status: 'COMPLETED',
        startTime: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
        },
      },
    });

    res.json({
      teamMember: {
        id: teamMember.id,
        fullName: teamMember.user.fullName,
        specialty: teamMember.specialty,
        bio: teamMember.bio,
        imageUrl: teamMember.imageUrl,
      },
      stats: {
        todayCount: todayAppointments.length,
        upcomingCount: upcomingAppointments.length,
        totalCompleted,
        thisMonthCompleted,
      },
      todayAppointments,
      upcomingAppointments,
    });
  } catch (error) {
    throw error;
  }
};

// Reschedule an appointment
export const rescheduleAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { startTime } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!startTime) {
      throw new AppError('New start time is required', 400);
    }

    const newStartTime = new Date(startTime);

    // Use transaction to prevent race conditions
    const updatedAppointment = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Fetch the existing appointment
        const existingAppointment = await tx.appointment.findUnique({
          where: { id },
          include: { service: true },
        });

        if (!existingAppointment) {
          throw new AppError('Appointment not found', 404);
        }

        // Authorization check: only the customer who owns it or admin/employee can reschedule
        if (userRole === 'CUSTOMER' && existingAppointment.userId !== userId) {
          throw new AppError('Not authorized to reschedule this appointment', 403);
        }

        // Cannot reschedule completed or cancelled appointments
        if (existingAppointment.status === 'COMPLETED' || existingAppointment.status === 'CANCELLED') {
          throw new AppError('Cannot reschedule completed or cancelled appointments', 400);
        }

        // Calculate new end time based on service duration
        const newEndTime = new Date(newStartTime.getTime() + existingAppointment.service.duration * 60000);

        // Check for conflicts with other appointments
        const conflictingAppointments = await tx.appointment.findMany({
          where: {
            id: { not: id }, // Exclude the current appointment
            teamMemberId: existingAppointment.teamMemberId,
            status: {
              notIn: ['CANCELLED', 'NO_SHOW']
            },
            OR: [
              {
                AND: [
                  { startTime: { lte: newStartTime } },
                  { endTime: { gt: newStartTime } }
                ]
              },
              {
                AND: [
                  { startTime: { lt: newEndTime } },
                  { endTime: { gte: newEndTime } }
                ]
              },
              {
                AND: [
                  { startTime: { gte: newStartTime } },
                  { endTime: { lte: newEndTime } }
                ]
              }
            ]
          },
          select: { id: true }
        });

        if (conflictingAppointments.length > 0) {
          throw new AppError('This time slot is not available', 409);
        }

        // Check for blocked slots
        const blockedSlots = await tx.blockedSlot.findMany({
          where: {
            teamMemberId: existingAppointment.teamMemberId,
            OR: [
              {
                AND: [
                  { startTime: { lte: newStartTime } },
                  { endTime: { gt: newStartTime } }
                ]
              },
              {
                AND: [
                  { startTime: { lt: newEndTime } },
                  { endTime: { gte: newEndTime } }
                ]
              },
              {
                AND: [
                  { startTime: { gte: newStartTime } },
                  { endTime: { lte: newEndTime } }
                ]
              }
            ]
          },
          select: { id: true }
        });

        if (blockedSlots.length > 0) {
          throw new AppError('This time slot is blocked and not available', 409);
        }

        // Update the appointment
        const updated = await tx.appointment.update({
          where: { id },
          data: {
            startTime: newStartTime,
            endTime: newEndTime,
            status: 'PENDING', // Reset to pending after rescheduling
          },
          include: {
            service: true,
            teamMember: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    username: true,
                  },
                },
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        });

        return updated;
      },
      {
        isolationLevel: 'Serializable',
        timeout: 10000,
      }
    );

    res.json({
      message: 'Appointment rescheduled successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    // Fetch the appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        teamMember: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    if (!existingAppointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Authorization check: only the customer who owns it or admin/employee can cancel
    if (userRole === 'CUSTOMER' && existingAppointment.userId !== userId) {
      throw new AppError('Not authorized to cancel this appointment', 403);
    }

    // Cannot cancel already completed or cancelled appointments
    if (existingAppointment.status === 'COMPLETED') {
      throw new AppError('Cannot cancel completed appointments', 400);
    }

    if (existingAppointment.status === 'CANCELLED') {
      throw new AppError('Appointment is already cancelled', 400);
    }

    // Update appointment status to CANCELLED
    const cancelledAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: cancellationReason || 'Cancelled by customer',
      },
      include: {
        service: true,
        teamMember: {
          include: {
            user: {
              select: {
                fullName: true,
                username: true,
              },
            },
          },
        },
        user: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    res.json({
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppointment,
    });
  } catch (error) {
    throw error;
  }
};

// NEW: Create multiple appointments atomically (all-or-nothing)
export const createBulkAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { teamMemberId, serviceIds, startTime, notes } = req.body;
    const userId = req.user?.userId;

    if (!teamMemberId || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0 || !startTime) {
      throw new AppError('Team member, services, and start time are required', 400);
    }

    const appointmentStartTime = new Date(startTime);

    // Use serializable transaction for atomic bulk creation
    const appointments = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const createdAppointments = [];
        let currentStartTime = appointmentStartTime;

        // Fetch all services upfront
        const services = await tx.service.findMany({
          where: { id: { in: serviceIds } },
        });

        if (services.length !== serviceIds.length) {
          throw new AppError('One or more services not found', 404);
        }

        // FIRST: Check if ALL time slots are available
        for (let i = 0; i < services.length; i++) {
          const service = services[i];
          const slotEndTime = new Date(currentStartTime.getTime() + service.duration * 60000);

          // Check for conflicts
          const conflictingAppointments = await tx.appointment.findMany({
            where: {
              teamMemberId,
              status: { notIn: ['CANCELLED', 'NO_SHOW'] },
              OR: [
                { AND: [{ startTime: { lte: currentStartTime } }, { endTime: { gt: currentStartTime } }] },
                { AND: [{ startTime: { lt: slotEndTime } }, { endTime: { gte: slotEndTime } }] },
                { AND: [{ startTime: { gte: currentStartTime } }, { endTime: { lte: slotEndTime } }] },
              ],
            },
          });

          if (conflictingAppointments.length > 0) {
            throw new AppError(
              `Time slot not available: ${currentStartTime.toLocaleTimeString()} for ${service.name}. Please choose a different time.`,
              409
            );
          }

          // Check for blocked slots
          const blockedSlots = await tx.blockedSlot.findMany({
            where: {
              teamMemberId,
              OR: [
                { AND: [{ startTime: { lte: currentStartTime } }, { endTime: { gt: currentStartTime } }] },
                { AND: [{ startTime: { lt: slotEndTime } }, { endTime: { gte: slotEndTime } }] },
                { AND: [{ startTime: { gte: currentStartTime } }, { endTime: { lte: slotEndTime } }] },
              ],
            },
          });

          if (blockedSlots.length > 0) {
            throw new AppError(
              `Time slot is blocked: ${currentStartTime.toLocaleTimeString()} - ${slotEndTime.toLocaleTimeString()}`,
              409
            );
          }

          // Move to next service time slot
          currentStartTime = slotEndTime;
        }

        // ALL slots are available! Now create appointments
        currentStartTime = appointmentStartTime;

        for (let i = 0; i < services.length; i++) {
          const service = services[i];
          const slotEndTime = new Date(currentStartTime.getTime() + service.duration * 60000);

          const newAppointment = await tx.appointment.create({
            data: {
              userId: userId as string,
              serviceId: service.id,
              teamMemberId,
              startTime: currentStartTime,
              endTime: slotEndTime,
              status: 'PENDING',
              notes: notes || null,
            },
            include: {
              service: true,
              teamMember: {
                include: {
                  user: {
                    select: {
                      fullName: true,
                      username: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  fullName: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          });

          createdAppointments.push(newAppointment);
          currentStartTime = slotEndTime;
        }

        return createdAppointments;
      },
      {
        isolationLevel: 'Serializable',
        timeout: 15000,
      }
    );

    res.status(201).json({
      message: `Successfully booked ${appointments.length} service${appointments.length > 1 ? 's' : ''}`,
      appointments,
    });
  } catch (error) {
    throw error;
  }
};
