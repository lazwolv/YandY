import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

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

    // Check if the slot is available
    const appointmentStartTime = new Date(startTime);
    const service = await prisma.service.findUnique({ where: { id: serviceId } });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    // Calculate end time based on service duration
    const appointmentEndTime = new Date(appointmentStartTime.getTime() + service.duration * 60000);

    // Check for conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        teamMemberId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        OR: [
          {
            AND: [
              { startTime: { lte: appointmentStartTime } },
              { endTime: { gt: appointmentStartTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: appointmentEndTime } },
              { endTime: { gte: appointmentEndTime } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new AppError('This time slot is not available', 409);
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
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

    // Handle recurring appointments
    if (isRecurring && recurringPattern && recurringEndDate) {
      await createRecurringAppointments(
        userId as string,
        serviceId,
        teamMemberId,
        appointmentStartTime,
        recurringPattern,
        new Date(recurringEndDate),
        notes,
        service.duration
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
  const appointments = [];
  let currentDate = new Date(startDate);

  // Determine interval based on pattern
  const intervalDays = pattern === 'WEEKLY' ? 7 : pattern === 'BIWEEKLY' ? 14 : 30;

  while (currentDate <= endDate) {
    currentDate = new Date(currentDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    if (currentDate > endDate) break;

    const currentEndTime = new Date(currentDate.getTime() + serviceDuration * 60000);

    // Check availability before creating
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        teamMemberId,
        startTime: currentDate,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    });

    if (!existingAppointment) {
      appointments.push({
        userId,
        serviceId,
        teamMemberId,
        startTime: currentDate,
        endTime: currentEndTime,
        status: 'PENDING' as any,
        notes,
      });
    }
  }

  // Batch create recurring appointments
  if (appointments.length > 0) {
    await prisma.appointment.createMany({
      data: appointments,
    });
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
