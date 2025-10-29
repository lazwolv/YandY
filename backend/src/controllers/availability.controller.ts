import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

// Get available time slots for a team member on a specific date
export const getAvailableSlots = async (req: Request, res: Response): Promise<any> => {
  try {
    const { teamMemberId, date } = req.query;

    if (!teamMemberId || !date) {
      throw new AppError('Team member ID and date are required', 400);
    }

    const selectedDate = new Date(date as string);
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 1=Monday, etc.

    // Get team member's regular availability for this day
    const availability = await prisma.availability.findFirst({
      where: {
        teamMemberId: teamMemberId as string,
        dayOfWeek: dayOfWeek,
        isActive: true,
      },
    });

    if (!availability) {
      res.json({ slots: [] });
      return;
    }

    // Get blocked slots for this date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        teamMemberId: teamMemberId as string,
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get existing appointments for this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        teamMemberId: teamMemberId as string,
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
      },
      include: {
        service: true,
      },
    });

    // Generate time slots (30-minute intervals)
    const slots = generateTimeSlots(
      availability.startTime,
      availability.endTime,
      existingAppointments,
      blockedSlots
    );

    res.json({ slots });
    return;
  } catch (error: any) {
    throw error;
  }
};

// Helper function to generate time slots
function generateTimeSlots(
  startTime: string,
  endTime: string,
  appointments: any[],
  blockedSlots: any[]
): Array<{ time: string; available: boolean }> {
  const slots: Array<{ time: string; available: boolean }> = [];

  // Parse start and end times (format: "HH:MM")
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Generate 30-minute slots
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

    // Check if slot is available
    const isBlocked = blockedSlots.some(slot => {
      const slotStartTime = new Date(slot.startTime).getHours() * 60 + new Date(slot.startTime).getMinutes();
      const slotEndTime = new Date(slot.endTime).getHours() * 60 + new Date(slot.endTime).getMinutes();
      return minutes >= slotStartTime && minutes < slotEndTime;
    });

    const isBooked = appointments.some(apt => {
      const aptTime = new Date(apt.startTime).getHours() * 60 + new Date(apt.startTime).getMinutes();
      const serviceDuration = apt.service.duration; // in minutes
      // Check if this slot overlaps with the appointment
      return minutes >= aptTime && minutes < aptTime + serviceDuration;
    });

    slots.push({
      time: formatTime(timeString),
      available: !isBlocked && !isBooked,
    });
  }

  return slots;
}

// Format time to 12-hour format
function formatTime(time24: string): string {
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Get team member's weekly availability
export const getTeamMemberAvailability = async (req: Request, res: Response) => {
  try {
    const { teamMemberId } = req.params;

    const availability = await prisma.availability.findMany({
      where: {
        teamMemberId,
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });

    res.json({ availability });
  } catch (error) {
    throw error;
  }
};

// Update team member availability (for employees)
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { teamMemberId } = req.params;
    const { dayOfWeek, startTime, endTime, isActive } = req.body;

    // Check if availability exists
    const existing = await prisma.availability.findFirst({
      where: {
        teamMemberId,
        dayOfWeek: parseInt(dayOfWeek),
      },
    });

    let availability;
    if (existing) {
      availability = await prisma.availability.update({
        where: { id: existing.id },
        data: { startTime, endTime, isActive },
      });
    } else {
      availability = await prisma.availability.create({
        data: {
          teamMemberId,
          dayOfWeek: parseInt(dayOfWeek),
          startTime,
          endTime,
          isActive,
        },
      });
    }

    res.json({ message: 'Availability updated successfully', availability });
  } catch (error) {
    throw error;
  }
};

// Add blocked slot (time off)
export const addBlockedSlot = async (req: Request, res: Response) => {
  try {
    const { teamMemberId } = req.params;
    const { startTime, endTime, reason } = req.body;

    const blockedSlot = await prisma.blockedSlot.create({
      data: {
        teamMemberId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reason,
      },
    });

    res.json({ message: 'Time blocked successfully', blockedSlot });
  } catch (error) {
    throw error;
  }
};

// Get all team members with their basic info
export const getAllTeamMembers = async (_req: Request, res: Response) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    res.json({ teamMembers });
  } catch (error) {
    throw error;
  }
};
