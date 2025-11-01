import { apiClient } from './client';

export interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
}

export interface AvailabilitySlots {
  slots: TimeSlot[];
  duration: number;
  message?: string;
}

export interface Availability {
  id: string;
  teamMemberId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // "HH:MM" format
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedSlot {
  id: string;
  teamMemberId: string;
  startTime: string; // ISO string
  endTime: string;
  reason?: string;
  createdAt: string;
}

export const availabilityApi = {
  // Get available time slots for a team member on a specific date
  getAvailableSlots: async (
    teamMemberId: string,
    date: string,
    duration: number
  ): Promise<AvailabilitySlots> => {
    const response = await apiClient.get('/availability/slots', {
      params: {
        teamMemberId,
        date,
        duration,
      },
    });
    return response.data;
  },

  // Get team member's weekly availability
  getTeamMemberAvailability: async (
    teamMemberId: string
  ): Promise<{ availability: Availability[] }> => {
    const response = await apiClient.get(`/availability/team-member/${teamMemberId}`);
    return response.data;
  },

  // Update team member availability for a specific day
  updateAvailability: async (
    teamMemberId: string,
    data: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }
  ): Promise<{ message: string; availability: Availability }> => {
    const response = await apiClient.put(`/availability/team-member/${teamMemberId}`, data);
    return response.data;
  },

  // Add blocked time slot (time off)
  addBlockedSlot: async (
    teamMemberId: string,
    data: {
      startTime: string; // ISO string
      endTime: string;
      reason?: string;
    }
  ): Promise<{ message: string; blockedSlot: BlockedSlot }> => {
    const response = await apiClient.post(`/availability/team-member/${teamMemberId}/block`, data);
    return response.data;
  },
};
