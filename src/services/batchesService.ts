import api from './api';

export interface Batch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  productSKU: string;
  initialQuantity: number;
  currentQuantity: number;
  receivedDate: string;
  expiryDate?: string;
  manufactureDate?: string;
  vendorId?: string;
  vendorName?: string;
  unitCost: number;
  totalValue: number;
  status: 'Active' | 'Depleted' | 'Expired' | 'Recalled';
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry: number;
  isRecalled: boolean;
  recallReason?: string;
  recallDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBatchRequest {
  batchNumber: string;
  productId: string;
  initialQuantity: number;
  unitCost: number;
  expiryDate?: string;
  manufactureDate?: string;
  vendorId?: string;
  purchaseOrderId?: string;
  notes?: string;
}

const batchesService = {
  getAll: async (params?: any): Promise<Batch[]> => {
    const response = await api.get('/Batches', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Batch> => {
    const response = await api.get(`/Batches/${id}`);
    return response.data;
  },

  getProductBatchesFIFO: async (productId: string): Promise<any[]> => {
    const response = await api.get(`/Batches/product/${productId}/fifo`);
    return response.data;
  },

  create: async (data: CreateBatchRequest): Promise<string> => {
    const response = await api.post('/Batches', data);
    return response.data;
  },

  recall: async (id: string, reason: string): Promise<any> => {
    const response = await api.post(`/Batches/${id}/recall`, { reason });
    return response.data;
  },

  markExpired: async (id: string): Promise<void> => {
    await api.post(`/Batches/${id}/mark-expired`);
  },

  updateNotes: async (id: string, notes: string): Promise<void> => {
    await api.put(`/Batches/${id}/notes`, { notes });
  },

  getExpiring: async (daysAhead: number = 30): Promise<any[]> => {
    const response = await api.get('/Batches/expiring', {
      params: { daysAhead }
    });
    return response.data;
  },

  getStatistics: async (): Promise<any> => {
    const response = await api.get('/Batches/statistics');
    return response.data;
  },
};

export default batchesService;
