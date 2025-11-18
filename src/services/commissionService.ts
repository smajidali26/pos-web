import apiClient from './apiClient';

// Enums
export enum CommissionType {
  Percentage = 'Percentage',
  FixedAmount = 'FixedAmount',
  Tiered = 'Tiered'
}

export enum CommissionBasis {
  TotalSale = 'TotalSale',
  GrossProfit = 'GrossProfit',
  ItemsSold = 'ItemsSold',
  Category = 'Category'
}

export enum CommissionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Paid = 'Paid',
  Voided = 'Voided'
}

// Interfaces
export interface Commission {
  id: string;
  name: string;
  description: string;
  commissionType: CommissionType;
  commissionBasis: CommissionBasis;
  rate: number;
  minimumSaleAmount?: number;
  maximumCommission?: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  employeeProfileId?: string;
  productId?: string;
  categoryId?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  employeeProfile?: {
    id: string;
    employeeCode: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CommissionTransaction {
  id: string;
  employeeProfileId: string;
  commissionId: string;
  orderId: string;
  orderItemId?: string;
  transactionDate: string;
  saleAmount: number;
  commissionAmount: number;
  status: CommissionStatus;
  paidDate?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  employeeProfile?: {
    id: string;
    employeeCode: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  commission?: Commission;
}

export interface CreateCommissionRequest {
  name: string;
  description: string;
  commissionType: CommissionType;
  commissionBasis: CommissionBasis;
  rate: number;
  minimumSaleAmount?: number;
  maximumCommission?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  employeeProfileId?: string;
  productId?: string;
  categoryId?: string;
  role?: string;
}

export interface UpdateCommissionRequest {
  name?: string;
  description?: string;
  rate?: number;
  minimumSaleAmount?: number;
  maximumCommission?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface CalculateCommissionsRequest {
  orderId: string;
}

export interface ProcessPaymentRequest {
  commissionIds: string[];
  paymentReference: string;
  paidDate?: string;
}

export interface CommissionListResponse {
  items: Commission[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CommissionTransactionListResponse {
  items: CommissionTransaction[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CommissionSummary {
  employeeProfileId: string;
  employeeName: string;
  totalPending: number;
  totalApproved: number;
  totalPaid: number;
  transactionCount: number;
}

const commissionService = {
  /**
   * Get all commission rules
   */
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
    employeeProfileId?: string;
  }) => apiClient.get<CommissionListResponse>('/api/commissions', { params }),

  /**
   * Get commission by ID
   */
  getById: (id: string) =>
    apiClient.get<Commission>(`/api/commissions/${id}`),

  /**
   * Get active commission rules
   */
  getActive: (params?: {
    employeeProfileId?: string;
    role?: string;
  }) => apiClient.get<Commission[]>('/api/commissions/active', { params }),

  /**
   * Get commission rules by employee
   */
  getByEmployee: (employeeId: string) =>
    apiClient.get<Commission[]>(`/api/commissions/employee/${employeeId}`),

  /**
   * Create new commission rule
   */
  create: (data: CreateCommissionRequest) =>
    apiClient.post<Commission>('/api/commissions', data),

  /**
   * Update commission rule
   */
  update: (id: string, data: UpdateCommissionRequest) =>
    apiClient.put<Commission>(`/api/commissions/${id}`, data),

  /**
   * Activate commission rule
   */
  activate: (id: string) =>
    apiClient.put<Commission>(`/api/commissions/${id}/activate`, {}),

  /**
   * Deactivate commission rule
   */
  deactivate: (id: string) =>
    apiClient.put<Commission>(`/api/commissions/${id}/deactivate`, {}),

  /**
   * Delete commission rule
   */
  delete: (id: string) =>
    apiClient.delete(`/api/commissions/${id}`),

  /**
   * Get commission transactions for employee
   */
  getTransactions: (employeeId: string, params?: {
    page?: number;
    pageSize?: number;
    status?: CommissionStatus;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get<CommissionTransactionListResponse>(
    `/api/commissions/transactions/${employeeId}`,
    { params }
  ),

  /**
   * Get all pending commissions
   */
  getPendingCommissions: (params?: {
    page?: number;
    pageSize?: number;
    employeeProfileId?: string;
  }) => apiClient.get<CommissionTransactionListResponse>('/api/commissions/pending', { params }),

  /**
   * Calculate commissions for an order
   */
  calculateForOrder: (orderId: string) =>
    apiClient.post<CommissionTransaction[]>(`/api/commissions/calculate/${orderId}`, {}),

  /**
   * Approve commission transaction
   */
  approveTransaction: (transactionId: string) =>
    apiClient.put<CommissionTransaction>(`/api/commissions/transactions/${transactionId}/approve`, {}),

  /**
   * Void commission transaction
   */
  voidTransaction: (transactionId: string, reason?: string) =>
    apiClient.put<CommissionTransaction>(`/api/commissions/transactions/${transactionId}/void`, { reason }),

  /**
   * Process commission payments
   */
  processPayment: (data: ProcessPaymentRequest) =>
    apiClient.post<CommissionTransaction[]>('/api/commissions/process-payment', data),

  /**
   * Get commission summary for employee
   */
  getSummary: (employeeId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) => apiClient.get<CommissionSummary>(`/api/commissions/summary/${employeeId}`, { params })
};

export default commissionService;
