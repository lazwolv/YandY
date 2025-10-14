import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      config.headers['x-user-id'] = user.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  requestVerification: (phoneNumber) =>
    api.post('/auth/request-verification', { phoneNumber }),

  verify: (phoneNumber, code) =>
    api.post('/auth/verify', { phoneNumber, code }),
};

// Appointment endpoints
export const appointmentAPI = {
  create: (appointmentData) =>
    api.post('/appointments', appointmentData),

  getUserAppointments: (userId) =>
    api.get(`/appointments/${userId}`),

  update: (appointmentId, data) =>
    api.put(`/appointments/${appointmentId}`, data),

  cancel: (appointmentId) =>
    api.delete(`/appointments/${appointmentId}`),
};

export default api;
