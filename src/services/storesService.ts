import apiClient from './apiClient';
import {
  Store,
  StoreHierarchyNode,
  StoreInventory,
  StoreSummary,
  CreateStoreRequest,
  UpdateStoreRequest,
  AdjustInventoryRequest,
  StoresListResponse,
  StoresQueryParams
} from '../types/store';

export const storesService = {
  // Get all stores with optional filters and pagination
  getAllStores: async (params: StoresQueryParams = {}): Promise<StoresListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.storeType) queryParams.append('storeType', params.storeType);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.parentStoreId) queryParams.append('parentStoreId', params.parentStoreId);

    const queryString = queryParams.toString();
    const url = `/api/Stores${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<StoresListResponse>(url);
    return response.data;
  },

  // Get store by ID
  getStoreById: async (id: string): Promise<Store> => {
    const response = await apiClient.get<Store>(`/api/Stores/${id}`);
    return response.data;
  },

  // Get store hierarchy
  getStoreHierarchy: async (): Promise<StoreHierarchyNode[]> => {
    const response = await apiClient.get<StoreHierarchyNode[]>('/api/Stores/hierarchy');
    return response.data;
  },

  // Get store inventory
  getStoreInventory: async (storeId: string): Promise<StoreInventory> => {
    const response = await apiClient.get<StoreInventory>(`/api/Stores/${storeId}/inventory`);
    return response.data;
  },

  // Get store summary/dashboard data
  getStoreSummary: async (storeId: string): Promise<StoreSummary> => {
    const response = await apiClient.get<StoreSummary>(`/api/Stores/${storeId}/summary`);
    return response.data;
  },

  // Create new store
  createStore: async (storeData: CreateStoreRequest): Promise<string> => {
    const response = await apiClient.post<string>('/api/Stores', storeData);
    return response.data;
  },

  // Update store
  updateStore: async (id: string, storeData: UpdateStoreRequest): Promise<void> => {
    await apiClient.put(`/api/Stores/${id}`, storeData);
  },

  // Activate store
  activateStore: async (id: string): Promise<void> => {
    await apiClient.post(`/api/Stores/${id}/activate`);
  },

  // Deactivate store
  deactivateStore: async (id: string): Promise<void> => {
    await apiClient.post(`/api/Stores/${id}/deactivate`);
  },

  // Update store manager
  updateStoreManager: async (id: string, managerId: string): Promise<void> => {
    await apiClient.put(`/api/Stores/${id}/manager`, { managerId });
  },

  // Adjust inventory for a product in a store
  adjustInventory: async (storeId: string, adjustmentData: AdjustInventoryRequest): Promise<void> => {
    await apiClient.post(`/api/Stores/${storeId}/adjust-inventory`, adjustmentData);
  },

  // Update stock levels for multiple products
  updateStockLevels: async (storeId: string, stockUpdates: Array<{ productId: string; quantity: number }>): Promise<void> => {
    await apiClient.post(`/api/Stores/${storeId}/update-stock-levels`, { stockUpdates });
  },

  // Get stores by type
  getStoresByType: async (storeType: string): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>(`/api/Stores/by-type/${storeType}`);
    return response.data;
  },

  // Get child stores
  getChildStores: async (parentStoreId: string): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>(`/api/Stores/${parentStoreId}/children`);
    return response.data;
  },

  // Search stores
  searchStores: async (searchTerm: string): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>(`/api/Stores/search?searchTerm=${searchTerm}`);
    return response.data;
  }
};

export default storesService;
