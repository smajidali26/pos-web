// Store Types for Multi-Store/Branch Management

export enum StoreType {
  WAREHOUSE = 'Warehouse',
  RETAIL = 'Retail',
  BRANCH = 'Branch',
  OUTLET = 'Outlet'
}

export interface Store {
  id: string;
  name: string;
  code: string;
  storeType: StoreType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  managerId?: string;
  managerName?: string;
  parentStoreId?: string;
  parentStoreName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreHierarchyNode {
  store: Store;
  children: StoreHierarchyNode[];
  level: number;
}

export interface StoreInventoryItem {
  productId: string;
  productName: string;
  sku: string;
  categoryName: string;
  currentStock: number;
  minStockLevel: number;
  reorderLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  inventoryValue: number;
  lastUpdated: string;
}

export interface StoreInventory {
  storeId: string;
  storeName: string;
  items: StoreInventoryItem[];
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface StoreSummary {
  storeId: string;
  storeName: string;
  totalInventoryValue: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  pendingIncomingTransfers: number;
  pendingOutgoingTransfers: number;
  topProducts: TopProductItem[];
  recentTransfers: RecentTransferItem[];
}

export interface TopProductItem {
  productId: string;
  productName: string;
  quantity: number;
  value: number;
}

export interface RecentTransferItem {
  transferId: string;
  transferNumber: string;
  fromStoreName?: string;
  toStoreName?: string;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface CreateStoreRequest {
  name: string;
  code: string;
  storeType: StoreType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  managerId?: string;
  parentStoreId?: string;
  isActive?: boolean;
}

export interface UpdateStoreRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  managerId?: string;
}

export interface AdjustInventoryRequest {
  productId: string;
  quantity: number;
  reason: string;
}

export interface StoresListResponse {
  items: Store[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StoresQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  storeType?: StoreType;
  isActive?: boolean;
  parentStoreId?: string;
}
