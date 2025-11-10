import apiClient from './apiClient';

export interface Size {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSizeRequest {
  name: string;
  description: string;
}

export interface UpdateSizeRequest {
  name: string;
  description: string;
}

export const sizesService = {
  getAll: async (): Promise<Size[]> => {
    const response = await apiClient.get('/api/sizes');
    return response.data;
  },

  getById: async (id: string): Promise<Size> => {
    const response = await apiClient.get(`/api/sizes/${id}`);
    return response.data;
  },

  create: async (size: CreateSizeRequest): Promise<Size> => {
    const response = await apiClient.post('/api/sizes', size);
    return response.data;
  },

  update: async (id: string, size: UpdateSizeRequest): Promise<Size> => {
    const response = await apiClient.put(`/api/sizes/${id}`, size);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/sizes/${id}`);
  },
};
