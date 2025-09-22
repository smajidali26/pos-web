import apiClient from './apiClient';

// Types for categories
export interface Category {
  categoryId?: number;
  categoryName: string;
  description?: string;
  picture?: string;
  isActive?: boolean;
  createdDate?: string;
  updatedDate?: string;
  productCount?: number;
}

export interface CategoryListResponse {
  categories: Category[];
  totalCount: number;
  message?: string;
}

export interface CategoryResponse {
  category: Category;
  message?: string;
}

export interface CreateCategoryData {
  categoryName: string;
  description?: string;
  picture?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  categoryName?: string;
  description?: string;
  picture?: string;
  isActive?: boolean;
}

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

export interface ProductsByCategoryResponse {
  products: Product[];
  categoryName?: string;
  totalCount: number;
  message?: string;
}

export const categoriesService = {
  // Get all categories
  getAllCategories: async (): Promise<CategoryListResponse> => {
    const response = await apiClient.get<CategoryListResponse>('/api/Categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<CategoryResponse> => {
    const response = await apiClient.get<CategoryResponse>(`/api/Categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData: CreateCategoryData): Promise<CategoryResponse> => {
    const response = await apiClient.post<CategoryResponse>('/api/Categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, categoryData: UpdateCategoryData): Promise<CategoryResponse> => {
    const response = await apiClient.put<CategoryResponse>(`/api/Categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/Categories/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number): Promise<ProductsByCategoryResponse> => {
    const response = await apiClient.get<ProductsByCategoryResponse>(`/api/Categories/${categoryId}/products`);
    return response.data;
  }
};

export default categoriesService;
