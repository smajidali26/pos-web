import apiClient from './apiClient';

// Types for products matching the API ProductDto
export interface Product {
  id: string;
  name: string;
  description: string;
  sizeId?: string;
  sizeName?: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  reorderLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
  unit?: ProductUnit;
  pricePerBaseUnit: number;
  costPerBaseUnit: number;
  totalBaseUnitQuantity: number;
  stockDisplayString: string;
  weight?: number;
  weightUnitSymbol?: string;
  volume?: number;
  volumeUnitSymbol?: string;
  inventoryValue: number;
  needsReorder: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  isWeightBased: boolean;
  isVolumeBased: boolean;
  isCountBased: boolean;
  primaryVendorId?: string;
  primaryVendorName?: string;
  vendorProductCode: string;
  lastPurchaseCost: number;
  lastPurchaseDate?: string;
}

export interface ProductUnit {
  baseUnit: UnitOfMeasure;
  baseQuantity: number;
  packagingUnit?: UnitOfMeasure;
  packagingQuantity?: number;
  displayName: string;
  hasPackaging: boolean;
  sellingUnit: UnitOfMeasure;
  quantityPerSellingUnit: number;
  weight?: number;
  weightUnit?: UnitOfMeasure;
  volume?: number;
  volumeUnit?: UnitOfMeasure;
  hasPhysicalWeight: boolean;
  hasPhysicalVolume: boolean;
}

export interface UnitOfMeasure {
  code: string;
  name: string;
  symbol: string;
  type: string;
  conversionFactorToBase: number;
  isBaseUnit: boolean;
}

// API Response format matching PagedResult<ProductDto>
export interface ProductsListResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductResponse {
  product: Product;
  message?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  categoryId: string;
  isActive?: boolean;
}

export interface UpdateProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  minStockLevel: number;
  categoryId: string;
}

export interface ProductsQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: string;
  isActive?: boolean;
  isLowStock?: boolean;
  includeInactive?: boolean;
}

export interface ProductsByCategoryParams {
  page?: number;
  pageSize?: number;
  includeInactive?: boolean;
}

export const productsService = {
  // Get all products with optional filters and pagination
  getAllProducts: async (params: ProductsQueryParams = {}): Promise<ProductsListResponse> => {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    // Add search term
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

    // Add category filter
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);

    // Add active filter
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    // Add low stock filter
    if (params.isLowStock !== undefined) queryParams.append('isLowStock', params.isLowStock.toString());

    // Add include inactive flag
    if (params.includeInactive !== undefined) queryParams.append('includeInactive', params.includeInactive.toString());

    const queryString = queryParams.toString();
    const url = `/api/Products${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ProductsListResponse>(url);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/Products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: CreateProductData): Promise<string> => {
    const response = await apiClient.post<string>('/api/Products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, productData: Omit<UpdateProductData, 'id'>): Promise<void> => {
    // Backend expects the ID in both URL and body
    const updateData: UpdateProductData = {
      ...productData,
      id: id
    };
    await apiClient.put(`/api/Products/${id}`, updateData);
  },

  // Delete product - API doesn't have delete, so this will deactivate instead
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.post(`/api/Products/${id}/deactivate`);
  },

  // Activate product
  activateProduct: async (id: string): Promise<void> => {
    await apiClient.post(`/api/Products/${id}/activate`);
  },

  // Deactivate product
  deactivateProduct: async (id: string): Promise<void> => {
    await apiClient.post(`/api/Products/${id}/deactivate`);
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string, params: ProductsByCategoryParams = {}): Promise<Product[]> => {
    const queryParams = new URLSearchParams();

    if (params.includeInactive !== undefined) queryParams.append('includeInactive', params.includeInactive.toString());

    const queryString = queryParams.toString();
    const url = `/api/Products/category/${categoryId}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<Product[]>(url);
    return response.data;
  },

  // Get low stock products
  getLowStockProducts: async (includeOutOfStock: boolean = true): Promise<Product[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('includeOutOfStock', includeOutOfStock.toString());

    const response = await apiClient.get<Product[]>(`/api/Products/low-stock?${queryParams.toString()}`);
    return response.data;
  },

  // Get products needing reorder
  getProductsNeedingReorder: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/api/Products/reorder-needed');
    return response.data;
  },

  // Search products
  searchProducts: async (searchTerm: string, categoryId?: string, isActive?: boolean, isLowStock?: boolean): Promise<Product[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('searchTerm', searchTerm);

    if (categoryId) queryParams.append('categoryId', categoryId);
    if (isActive !== undefined) queryParams.append('isActive', isActive.toString());
    if (isLowStock !== undefined) queryParams.append('isLowStock', isLowStock.toString());

    const response = await apiClient.get<Product[]>(`/api/Products/search?${queryParams.toString()}`);
    return response.data;
  },

  // Update product stock
  updateStock: async (id: string, newQuantity: number, reason?: string): Promise<void> => {
    const requestData = {
      newQuantity: newQuantity,
      reason: reason
    };
    await apiClient.put(`/api/Products/${id}/stock`, requestData);
  }
};

export default productsService;
