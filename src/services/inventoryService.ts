import api from './api';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  productSKU: string;
  type: 'StockIn' | 'StockOut' | 'Adjustment' | 'Transfer' | 'Return' | 'Damage' | 'Theft' | 'Expiry';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unitCost?: number;
  reason: string;
  referenceNumber?: string;
  referenceId?: string;
  movementDate: string;
  locationId?: string;
  locationName?: string;
  movedByUser: string;
  createdAt: string;
}

export interface InventoryAdjustmentRequest {
  productId: string;
  newQuantity: number;
  reason: string;
  referenceNumber?: string;
  referenceId?: string;
  unitCost?: number;
  locationId?: string;
}

export interface StockLevel {
  productId: string;
  productName: string;
  sku: string;
  locationId?: string;
  locationName?: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  reorderLevel?: number;
  binLocation?: string;
  isLowStock: boolean;
  isOutOfStock?: boolean;
  isOverStock?: boolean;
  needsReorder?: boolean;
}

export interface InventorySummary {
  locationId: string;
  locationName: string;
  locationCode: string;
  totalProducts: number;
  totalQuantity: number;
  lowStockProducts: number;
  overstockProducts: number;
  outOfStockProducts: number;
}

const inventoryService = {
  // Get inventory movements history
  getInventoryMovements: async (params?: {
    productId?: string;
    locationId?: string;
    movementType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<InventoryMovement[]> => {
    const response = await api.get('/Inventory/movements', { params });
    return response.data;
  },

  // Get inventory movement by ID
  getInventoryMovementById: async (id: string): Promise<InventoryMovement> => {
    const response = await api.get(`/Inventory/movements/${id}`);
    return response.data;
  },

  // Record inventory adjustment
  recordInventoryAdjustment: async (data: InventoryAdjustmentRequest): Promise<{ movementId: string; message: string }> => {
    const response = await api.post('/Inventory/movements/adjustment', data);
    return response.data;
  },

  // Get stock level
  getStockLevel: async (productId: string, locationId?: string): Promise<StockLevel> => {
    const response = await api.get('/Inventory/stock-level', {
      params: { productId, locationId }
    });
    return response.data;
  },

  // Get stock levels for a product across all locations
  getStockLevelAllLocations: async (productId: string): Promise<StockLevel[]> => {
    const response = await api.get(`/Inventory/stock-level/product/${productId}/all-locations`);
    return response.data;
  },

  // Get inventory summary by location
  getInventorySummaryByLocation: async (locationId: string): Promise<InventorySummary> => {
    const response = await api.get(`/Inventory/summary/by-location/${locationId}`);
    return response.data;
  },
};

export default inventoryService;
