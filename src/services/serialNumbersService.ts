import api from './api';

export interface SerialNumber {
  id: string;
  number: string;
  productId: string;
  productName: string;
  batchId?: string;
  batchNumber?: string;
  status: 'Available' | 'Sold' | 'Returned' | 'Defective' | 'Disposed';
  customerId?: string;
  customerName?: string;
  orderId?: string;
  soldDate?: string;
  returnedDate?: string;
  locationId?: string;
  locationName?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  isUnderWarranty: boolean;
  daysRemainingInWarranty: number;
  createdBy: string;
  createdAt: string;
}

export interface CreateSerialNumberRequest {
  number: string;
  productId: string;
  batchId?: string;
  locationId?: string;
  warrantyMonths: number;
  notes?: string;
}

const serialNumbersService = {
  getAll: async (params?: any): Promise<SerialNumber[]> => {
    const response = await api.get('/SerialNumbers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/SerialNumbers/${id}`);
    return response.data;
  },

  create: async (data: CreateSerialNumberRequest): Promise<string> => {
    const response = await api.post('/SerialNumbers', data);
    return response.data;
  },

  transfer: async (id: string, toLocationId: string, reason?: string): Promise<void> => {
    await api.post(`/SerialNumbers/${id}/transfer`, { toLocationId, reason });
  },

  markDefective: async (id: string, reason: string): Promise<void> => {
    await api.post(`/SerialNumbers/${id}/mark-defective`, { reason });
  },

  repair: async (id: string, notes: string): Promise<void> => {
    await api.post(`/SerialNumbers/${id}/repair`, { notes });
  },

  getWarrantyExpiring: async (daysAhead: number = 30): Promise<any[]> => {
    const response = await api.get('/SerialNumbers/warranty-expiring', {
      params: { daysAhead }
    });
    return response.data;
  },
};

export default serialNumbersService;
