import apiClient from './apiClient';

// Types for categories matching backend CategoryDto
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentCategoryId?: string;
  parentCategoryName?: string;
  subCategories: Category[];
  createdAt: string;
  updatedAt?: string;
  subCategoryCount: number;
  productCount: number;
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
  name: string;
  description?: string;
  isActive?: boolean;
  parentCategoryId?: string;
}

export interface UpdateCategoryData {
  id: string;
  name: string;
  description: string;
  parentCategoryId?: string;
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
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/Categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/api/Categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData: CreateCategoryData): Promise<string> => {
    const response = await apiClient.post<string>('/api/Categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id: string, categoryData: Omit<UpdateCategoryData, 'id'>): Promise<void> => {
    // Backend expects the ID in both URL and body
    const updateData: UpdateCategoryData = {
      ...categoryData,
      id: id
    };
    await apiClient.put(`/api/Categories/${id}`, updateData);
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Categories/${id}`);
  },

  // Get products by category - returns array of products
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/api/Products/category/${categoryId}`);
    return response.data;
  }
};

export default categoriesService;
