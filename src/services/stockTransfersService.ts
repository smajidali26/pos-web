import api from './api';

export interface StockTransfer {
  id: string;
  transferNumber: string;
  productId: string;
  productName: string;
  productSKU: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  requestedQuantity: number;
  shippedQuantity: number;
  receivedQuantity: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'InTransit' | 'Received' | 'Completed' | 'Cancelled';
  requestedDate: string;
  shippedDate?: string;
  receivedDate?: string;
  requestedBy: string;
  approvedBy?: string;
  hasVariance: boolean;
  variance: number;
  variancePercentage: number;
  trackingNumber?: string;
  shippingCost?: number;
  notes?: string;
  receiverNotes?: string;
}

export interface CreateStockTransferRequest {
  productId: string;
  fromLocationId: string;
  toLocationId: string;
  requestedQuantity: number;
  notes?: string;
}

export interface StockTransferStatistics {
  pendingCount: number;
  approvedCount: number;
  inTransitCount: number;
  completedCount: number;
  rejectedCount: number;
  cancelledCount: number;
  totalWithVariance: number;
  averageTransferTime: number;
}

export interface ReceiveResponse {
  message: string;
}

export interface GetStockTransfersParams {
  productId?: string;
  fromLocationId?: string;
  toLocationId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

const stockTransfersService = {
  getAll: async (params?: GetStockTransfersParams): Promise<StockTransfer[]> => {
    const response = await api.get('/StockTransfers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<StockTransfer> => {
    const response = await api.get(`/StockTransfers/${id}`);
    return response.data;
  },

  create: async (data: CreateStockTransferRequest): Promise<string> => {
    const response = await api.post('/StockTransfers', data);
    return response.data;
  },

  approve: async (id: string): Promise<void> => {
    await api.post(`/StockTransfers/${id}/approve`);
  },

  reject: async (id: string, reason: string): Promise<void> => {
    await api.post(`/StockTransfers/${id}/reject`, { reason });
  },

  ship: async (id: string, shippedQuantity: number, trackingNumber?: string, shippingCost?: number): Promise<void> => {
    await api.post(`/StockTransfers/${id}/ship`, { shippedQuantity, trackingNumber, shippingCost });
  },

  receive: async (id: string, receivedQuantity: number, receiverNotes?: string): Promise<ReceiveResponse> => {
    const response = await api.post(`/StockTransfers/${id}/receive`, { receivedQuantity, receiverNotes });
    return response.data;
  },

  complete: async (id: string): Promise<void> => {
    await api.post(`/StockTransfers/${id}/complete`);
  },

  cancel: async (id: string, reason: string): Promise<void> => {
    await api.post(`/StockTransfers/${id}/cancel`, { reason });
  },

  getStatistics: async (startDate?: string, endDate?: string): Promise<StockTransferStatistics> => {
    const response = await api.get('/StockTransfers/statistics', {
      params: { startDate, endDate }
    });
    return response.data;
  },
};

export default stockTransfersService;
