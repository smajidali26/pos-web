import apiClient from './apiClient';
import {
  InterStoreTransfer,
  CreateTransferRequest,
  UpdateTransferRequest,
  SubmitTransferRequest,
  ApproveTransferRequest,
  RejectTransferRequest,
  ShipTransferRequest,
  CompleteTransferRequest,
  CancelTransferRequest,
  TransfersListResponse,
  TransfersQueryParams,
  TransferTimeline
} from '../types/interStoreTransfer';

export const interStoreTransfersService = {
  // Get all transfers with optional filters and pagination
  getAllTransfers: async (params: TransfersQueryParams = {}): Promise<TransfersListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.status) queryParams.append('status', params.status);
    if (params.fromStoreId) queryParams.append('fromStoreId', params.fromStoreId);
    if (params.toStoreId) queryParams.append('toStoreId', params.toStoreId);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);

    const queryString = queryParams.toString();
    const url = `/api/InterStoreTransfers${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<TransfersListResponse>(url);
    return response.data;
  },

  // Get transfer by ID
  getTransferById: async (id: string): Promise<InterStoreTransfer> => {
    const response = await apiClient.get<InterStoreTransfer>(`/api/InterStoreTransfers/${id}`);
    return response.data;
  },

  // Get pending transfers (awaiting approval)
  getPendingTransfers: async (): Promise<InterStoreTransfer[]> => {
    const response = await apiClient.get<InterStoreTransfer[]>('/api/InterStoreTransfers/pending');
    return response.data;
  },

  // Get transfers by store (incoming or outgoing)
  getTransfersByStore: async (storeId: string, direction?: 'incoming' | 'outgoing'): Promise<InterStoreTransfer[]> => {
    const queryParams = new URLSearchParams();
    if (direction) queryParams.append('direction', direction);

    const queryString = queryParams.toString();
    const url = `/api/InterStoreTransfers/store/${storeId}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<InterStoreTransfer[]>(url);
    return response.data;
  },

  // Get transfer timeline/history
  getTransferTimeline: async (id: string): Promise<TransferTimeline[]> => {
    const response = await apiClient.get<TransferTimeline[]>(`/api/InterStoreTransfers/${id}/timeline`);
    return response.data;
  },

  // Create new transfer (Draft status)
  createTransfer: async (transferData: CreateTransferRequest): Promise<string> => {
    const response = await apiClient.post<string>('/api/InterStoreTransfers', transferData);
    return response.data;
  },

  // Update transfer (only in Draft status)
  updateTransfer: async (id: string, transferData: UpdateTransferRequest): Promise<void> => {
    await apiClient.put(`/api/InterStoreTransfers/${id}`, transferData);
  },

  // Submit transfer for approval (Draft -> Pending)
  submitTransfer: async (id: string, data?: SubmitTransferRequest): Promise<void> => {
    await apiClient.post(`/api/InterStoreTransfers/${id}/submit`, data || {});
  },

  // Approve transfer (Pending -> Approved)
  approveTransfer: async (id: string, data?: ApproveTransferRequest): Promise<void> => {
    await apiClient.post(`/api/InterStoreTransfers/${id}/approve`, data || {});
  },

  // Reject transfer (Pending -> Rejected)
  rejectTransfer: async (id: string, data: RejectTransferRequest): Promise<void> => {
    await apiClient.post(`/api/InterStoreTransfers/${id}/reject`, data);
  },

  // Ship transfer (Approved -> In Transit)
  shipTransfer: async (id: string, data?: ShipTransferRequest): Promise<void> => {
    await apiClient.post(`/api/InterStoreTransfers/${id}/ship`, data || {});
  },

  // Complete transfer (In Transit -> Completed)
  completeTransfer: async (id: string, data?: CompleteTransferRequest): Promise<void> => {
    await apiClient.post(`/api/InterStoreTransfers/${id}/complete`, data || {});
  },

  // Cancel transfer (Draft/Pending/Approved -> Cancelled)
  cancelTransfer: async (id: string, data: CancelTransferRequest): Promise<void> => {
    await apiClient.post(`/api/InterStoreTransfers/${id}/cancel`, data);
  },

  // Search transfers
  searchTransfers: async (searchTerm: string): Promise<InterStoreTransfer[]> => {
    const response = await apiClient.get<InterStoreTransfer[]>(`/api/InterStoreTransfers/search?searchTerm=${searchTerm}`);
    return response.data;
  }
};

export default interStoreTransfersService;
