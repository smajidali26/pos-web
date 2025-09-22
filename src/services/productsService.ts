import apiClient from './apiClient';

// Types for products
export interface Product {
  productId: number;
  productName: string;
  categoryId: number;
  categoryName?: string;
  supplierId?: number;
  quantityPerUnit?: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder?: number;
  reorderLevel?: number;
  discontinued?: boolean;
  isActive?: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface ProductsListResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  message?: string;
}

export interface ProductResponse {
  product: Product;
  message?: string;
}

export interface CreateProductData {
  productName: string;
  categoryId: number;
  supplierId?: number;
  quantityPerUnit?: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder?: number;
  reorderLevel?: number;
  discontinued?: boolean;
  isActive?: boolean;
}

export interface UpdateProductData {
  productName?: string;
  categoryId?: number;
  supplierId?: number;
  quantityPerUnit?: string;
  unitPrice?: number;
  unitsInStock?: number;
  unitsOnOrder?: number;
  reorderLevel?: number;
  discontinued?: boolean;
  isActive?: boolean;
}

export interface ProductsQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductsByCategoryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
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
    if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    
    // Add sorting
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const queryString = queryParams.toString();
    const url = `/api/Products/GetAllProducts${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ProductsListResponse>(url);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<ProductResponse> => {
    const response = await apiClient.get<ProductResponse>(`/api/Products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: CreateProductData): Promise<ProductResponse> => {
    const response = await apiClient.post<ProductResponse>('/api/Products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, productData: UpdateProductData): Promise<ProductResponse> => {
    const response = await apiClient.put<ProductResponse>(`/api/Products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/Products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number, params: ProductsByCategoryParams = {}): Promise<ProductsListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

    const queryString = queryParams.toString();
    const url = `/api/Products/category/${categoryId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ProductsListResponse>(url);
    return response.data;
  }
};

export default productsService;
