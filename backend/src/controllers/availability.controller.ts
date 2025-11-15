import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

// Get available time slots for a team member on a specific date
export const getAvailableSlots = async (req: Request, res: Response): Promise<any> => {
  try {
    const { teamMemberId, date, duration } = req.query;

    if (!teamMemberId || !date) {
      throw new AppError('Team member ID and date are required', 400);
    }

    // Parse date string properly to avoid timezone issues
    // Date string format: "YYYY-MM-DD"
    const [year, month, day] = (date as string).split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 1=Monday, etc.
    const requiredDuration = duration ? parseInt(duration as string) : 30; // default to 30 if not provided

    // Get team member's regular availability for this day
    const availability = await prisma.availability.findFirst({
      where: {
        teamMemberId: teamMemberId as string,
        dayOfWeek: dayOfWeek,
        isActive: true,
      },
    });

    if (!availability) {
      res.json({ slots: [], message: 'Employee not available on this day' });
      return;
    }

    // Get blocked slots for this date (use local midnight for proper day boundary)
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

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

    // Generate duration-aware time slots
    const slots = generateDurationAwareSlots(
      availability.startTime,
      availability.endTime,
      existingAppointments,
      blockedSlots,
      requiredDuration
    );

    res.json({
      slots,
      duration: requiredDuration,
      message: slots.length === 0 ? `No ${requiredDuration}-minute slots available on this day` : undefined
    });
    return;
  } catch (error: any) {
    throw error;
  }
};

// Format time to 12-hour format
function formatTime(time24: string): string {
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

// NEW: Duration-aware slot generation with proper timezone handling
function generateDurationAwareSlots(
  startTime: string,
  endTime: string,
  appointments: any[],
  blockedSlots: any[],
  requiredDuration: number
): Array<{ time: string; endTime: string; available: boolean }> {
  const slots: Array<{ time: string; endTime: string; available: boolean }> = [];

  // Parse start and end times (format: "HH:MM")
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Helper: Convert appointment Date to minutes since midnight on the selected date
  const getMinutesFromMidnight = (datetime: Date): number => {
    return datetime.getHours() * 60 + datetime.getMinutes();
  };

  // Generate 30-minute interval START times only
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    // Check if there's enough time left in the day for this duration
    if (minutes + requiredDuration > endMinutes) {
      break; // Not enough time left
    }

    // Check if ALL 30-min slots within the required duration are free
    let isSlotAvailable = true;

    for (let checkMinute = minutes; checkMinute < minutes + requiredDuration; checkMinute += 30) {
      // Check if this 30-min slot is blocked
      const isBlocked = blockedSlots.some(slot => {
        const slotStartMinutes = getMinutesFromMidnight(new Date(slot.startTime));
        const slotEndMinutes = getMinutesFromMidnight(new Date(slot.endTime));
        return checkMinute >= slotStartMinutes && checkMinute < slotEndMinutes;
      });

      // Check if this 30-min slot is booked
      const isBooked = appointments.some(apt => {
        const aptStartMinutes = getMinutesFromMidnight(new Date(apt.startTime));
        const serviceDuration = apt.service.duration;
        return checkMinute >= aptStartMinutes && checkMinute < aptStartMinutes + serviceDuration;
      });

      if (isBlocked || isBooked) {
        isSlotAvailable = false;
        break;
      }
    }

    if (isSlotAvailable) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const startTimeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      const endMinute = minutes + requiredDuration;
      const endHour = Math.floor(endMinute / 60);
      const endMin = endMinute % 60;
      const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      slots.push({
        time: formatTime(startTimeString),
        endTime: formatTime(endTimeString),
        available: true,
      });
    }
  }

  return slots;
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
    // Only return team members who are available AND have a default schedule set
    // This filters out mock employees like Sarah Thompson who haven't been configured yet
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        isAvailable: true,
        hasDefaultSchedule: true, // Only show team members with configured schedules
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
