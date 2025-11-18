import api from './api';

export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'Store' | 'Warehouse' | 'Backroom' | 'Display' | 'Shelf' | 'Bin';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
  isActive: boolean;
  parentLocationId?: string;
  parentLocationName?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  subLocations?: { id: string; name: string; code: string; type: string }[];
  productCount?: number;
  totalQuantity?: number;
}

export interface CreateLocationRequest {
  name: string;
  code: string;
  type: 'Store' | 'Warehouse' | 'Backroom' | 'Display' | 'Shelf' | 'Bin';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  parentLocationId?: string;
  notes?: string;
}

export interface UpdateLocationRequest {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  parentLocationId?: string;
  notes?: string;
}

const locationsService = {
  // Get all locations
  getAll: async (type?: string, includeInactive?: boolean): Promise<Location[]> => {
    const response = await api.get('/Locations', {
      params: { type, includeInactive }
    });
    return response.data;
  },

  // Get location by ID
  getById: async (id: string): Promise<Location> => {
    const response = await api.get(`/Locations/${id}`);
    return response.data;
  },

  // Create location
  create: async (data: CreateLocationRequest): Promise<string> => {
    const response = await api.post('/Locations', data);
    return response.data;
  },

  // Update location
  update: async (id: string, data: UpdateLocationRequest): Promise<void> => {
    await api.put(`/Locations/${id}`, data);
  },

  // Activate location
  activate: async (id: string): Promise<void> => {
    await api.post(`/Locations/${id}/activate`);
  },

  // Deactivate location
  deactivate: async (id: string): Promise<void> => {
    await api.post(`/Locations/${id}/deactivate`);
  },

  // Get products at a location
  getLocationProducts: async (id: string, includeLowStock?: boolean, includeOverstock?: boolean): Promise<any[]> => {
    const response = await api.get(`/Locations/${id}/products`, {
      params: { includeLowStock, includeOverstock }
    });
    return response.data;
  },
};

export default locationsService;
