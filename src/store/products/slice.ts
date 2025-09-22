import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  ProductsState, 
  ProductItem, 
  Category, 
  UpdateStockPayload, 
  ProductsResponse, 
  CategoriesResponse, 
  ProductResponse
} from './types';

const initialState: ProductsState = {
  items: [],
  categories: [],
  selectedCategory: 'All',
  searchTerm: '',
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  sortBy: 'name',
  sortDirection: 'asc',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Filter and pagination actions
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page when changing category
    },
    
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    
    setSort: (state, action: PayloadAction<{ sortBy: string; sortDirection: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    
    updateStock: (state, action: PayloadAction<UpdateStockPayload>) => {
      const { id, inStock } = action.payload;
      const product = state.items.find(item => item.id === id);
      if (product) {
        product.inStock = inStock;
      }
    },

    // Fetch products actions
    fetchProductsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<ProductsResponse>) => {
      state.isLoading = false;
      state.error = null;
      state.items = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch categories actions
    fetchCategoriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<CategoriesResponse>) => {
      state.isLoading = false;
      state.error = null;
      state.categories = action.payload.categories;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Add product actions
    addProductRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addProductSuccess: (state, action: PayloadAction<ProductResponse>) => {
      state.isLoading = false;
      state.error = null;
      // Product will be refetched by saga
    },
    addProductFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update product actions
    updateProductRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProductSuccess: (state, action: PayloadAction<ProductResponse>) => {
      state.isLoading = false;
      state.error = null;
      // Product will be refetched by saga
    },
    updateProductFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete product actions
    deleteProductRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.error = null;
      // Remove product from local state
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    deleteProductFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setSelectedCategory, 
  setSearchTerm, 
  setPage,
  setPageSize,
  setSort,
  updateStock,
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addProductRequest,
  addProductSuccess,
  addProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
