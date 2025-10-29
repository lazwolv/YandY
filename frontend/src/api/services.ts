import { apiClient } from './client';

export interface Service {
  id: string;
  name: string;
  nameEs: string;
  description?: string;
  descriptionEs?: string;
  duration: number;
  price: number;
  isActive: boolean;
  category?: string;
  imageUrl?: string;
}

export const servicesApi = {
  getAllServices: async (): Promise<{ services: Service[] }> => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  getServiceById: async (id: string): Promise<{ service: Service }> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },
};
