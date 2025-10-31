import { apiClient } from './client';

export interface Appointment {
  id: string;
  userId: string;
  teamMemberId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  teamMember?: {
    id: string;
    user: {
      fullName: string;
      username: string;
    };
  };
}

export const appointmentsApi = {
  // Get all appointments for the current user (customer or employee)
  getMyAppointments: async (upcoming = false): Promise<{ appointments: Appointment[] }> => {
    const response = await apiClient.get('/appointments/my-appointments', {
      params: { upcoming: upcoming ? 'true' : 'false' },
    });
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<{ appointment: Appointment }> => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  // Create a new appointment
  createAppointment: async (data: {
    teamMemberId: string;
    serviceId: string;
    startTime: string;
    notes?: string;
  }): Promise<{ appointment: Appointment }> => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (
    id: string,
    status: Appointment['status']
  ): Promise<{ appointment: Appointment }> => {
    const response = await apiClient.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (
    id: string,
    reason?: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/appointments/${id}`, {
      data: { cancellationReason: reason },
    });
    return response.data;
  },

  // Employee-specific: Get employee appointments
  getEmployeeAppointments: async (date?: string, upcoming?: boolean): Promise<{ appointments: Appointment[] }> => {
    const params: any = {};
    if (date) params.date = date;
    if (upcoming) params.upcoming = 'true';
    const response = await apiClient.get('/appointments/employee/appointments', { params });
    return response.data;
  },

  // Employee-specific: Get employee dashboard data
  getEmployeeDashboard: async (): Promise<{
    teamMember: any;
    stats: {
      todayCount: number;
      upcomingCount: number;
      totalCompleted: number;
      thisMonthCompleted: number;
    };
    todayAppointments: Appointment[];
    upcomingAppointments: Appointment[];
  }> => {
    const response = await apiClient.get('/appointments/employee/dashboard');
    return response.data;
  },
};
