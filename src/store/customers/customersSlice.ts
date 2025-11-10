import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../services/customersService';

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchResults: Customer[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    isActive?: boolean;
    search?: string;
  };
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  searchResults: [],
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {}
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // Fetch customers
    fetchCustomersRequest: (state, action: PayloadAction<{
      page?: number;
      pageSize?: number;
      search?: string;
      isActive?: boolean;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        if (action.payload.page) state.currentPage = action.payload.page;
        if (action.payload.pageSize) state.pageSize = action.payload.pageSize;
        if (action.payload.search !== undefined) state.filters.search = action.payload.search;
        if (action.payload.isActive !== undefined) state.filters.isActive = action.payload.isActive;
      }
    },

    fetchCustomersSuccess: (state, action: PayloadAction<{
      items: Customer[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.customers = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchCustomersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Search customers
    searchCustomersRequest: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.isLoading = true;
      state.error = null;
    },

    searchCustomersSuccess: (state, action: PayloadAction<Customer[]>) => {
      state.searchResults = action.payload;
      state.isLoading = false;
    },

    searchCustomersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Select customer
    selectCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },

    // Create customer
    createCustomerRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },

    createCustomerSuccess: (state, action: PayloadAction<Customer>) => {
      state.customers.unshift(action.payload);
      state.totalCount += 1;
      state.isLoading = false;
    },

    createCustomerFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update customer
    updateCustomerRequest: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateCustomerSuccess: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      if (state.selectedCustomer?.id === action.payload.id) {
        state.selectedCustomer = action.payload;
      }
      state.isLoading = false;
    },

    updateCustomerFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Delete customer
    deleteCustomerRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteCustomerSuccess: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
      state.totalCount -= 1;
      if (state.selectedCustomer?.id === action.payload) {
        state.selectedCustomer = null;
      }
      state.isLoading = false;
    },

    deleteCustomerFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear search
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set page
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Set page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page
    }
  }
});

export const {
  fetchCustomersRequest,
  fetchCustomersSuccess,
  fetchCustomersFailure,
  searchCustomersRequest,
  searchCustomersSuccess,
  searchCustomersFailure,
  selectCustomer,
  createCustomerRequest,
  createCustomerSuccess,
  createCustomerFailure,
  updateCustomerRequest,
  updateCustomerSuccess,
  updateCustomerFailure,
  deleteCustomerRequest,
  deleteCustomerSuccess,
  deleteCustomerFailure,
  clearSearch,
  clearError,
  setPage,
  setPageSize
} = customersSlice.actions;

export default customersSlice.reducer;
