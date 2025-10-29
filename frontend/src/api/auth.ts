import { apiClient } from './client';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    points: number;
  };
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  points: number;
  createdAt: string;
  teamMember?: {
    id: string;
    specialty: string;
    bio: string;
    isAvailable: boolean;
  };
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  getProfile: async (): Promise<{ user: UserProfile }> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};
