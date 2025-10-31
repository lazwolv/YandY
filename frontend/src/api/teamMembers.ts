import { apiClient } from './client';

export interface TeamMember {
  id: string;
  userId: string;
  bio?: string;
  bioEs?: string;
  specialty: string;
  specialtyEs?: string;
  isAvailable: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    fullName: string;
  };
}

export const teamMembersApi = {
  getAllTeamMembers: async (): Promise<{ teamMembers: TeamMember[] }> => {
    const response = await apiClient.get('/availability/team-members');
    return response.data;
  },
};
