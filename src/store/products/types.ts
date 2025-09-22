// Products Types
export interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  description?: string;
  categoryId?: number;
  unitPrice?: number;
  unitsInStock?: number;
  discontinued?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface ProductsState {
  items: ProductItem[];
  categories: Category[];
  selectedCategory: string;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface UpdateStockPayload {
  id: number;
  inStock: boolean;
}

export interface AddProductPayload {
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  description?: string;
  categoryId?: number;
  unitPrice?: number;
  unitsInStock?: number;
}

export interface UpdateProductPayload {
  id: number;
  name?: string;
  price?: number;
  category?: string;
  image?: string;
  inStock?: boolean;
  description?: string;
  categoryId?: number;
  unitPrice?: number;
  unitsInStock?: number;
}

export interface FetchProductsPayload {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: ProductItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductResponse {
  product: ProductItem;
  message?: string;
}

export interface CategoriesResponse {
  categories: Category[];
  totalCount: number;
}
