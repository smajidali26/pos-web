import api from './api';

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  productSKU: string;
  locationId?: string;
  locationName?: string;
  alertType: 'LowStock' | 'OutOfStock' | 'Overstock' | 'ExpiringSoon' | 'Expired' | 'ReorderNeeded' | 'StockVariance';
  currentQuantity: number;
  thresholdQuantity: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Acknowledged' | 'Resolved' | 'Dismissed';
  triggeredDate: string;
  acknowledgedDate?: string;
  acknowledgedBy?: string;
  resolvedDate?: string;
  resolvedBy?: string;
  daysActive: number;
  isOverdue: boolean;
  notes?: string;
  resolutionNotes?: string;
}

const stockAlertsService = {
  getAll: async (params?: {
    status?: string;
    severity?: string;
    alertType?: string;
    productId?: string;
    locationId?: string;
  }): Promise<StockAlert[]> => {
    const response = await api.get('/StockAlerts', { params });
    return response.data;
  },

  acknowledge: async (id: string, notes?: string): Promise<void> => {
    await api.post(`/StockAlerts/${id}/acknowledge`, { notes });
  },

  resolve: async (id: string, resolutionNotes: string): Promise<void> => {
    await api.post(`/StockAlerts/${id}/resolve`, { resolutionNotes });
  },

  dismiss: async (id: string, reason: string): Promise<void> => {
    await api.post(`/StockAlerts/${id}/dismiss`, { reason });
  },

  getDashboardSummary: async (): Promise<{
    totalActiveAlerts: number;
    criticalAlerts: number;
    highPriorityAlerts: number;
    overdueAlerts: number;
    outOfStockAlerts: number;
    lowStockAlerts: number;
    expiringAlerts: number;
  }> => {
    const response = await api.get('/StockAlerts/dashboard-summary');
    return response.data;
  },
};

export default stockAlertsService;
