import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Store,
  StoreHierarchyNode,
  StoreInventory,
  StoreSummary,
  StoresListResponse,
  CreateStoreRequest,
  UpdateStoreRequest,
  StoresQueryParams
} from '../../types/store';

export interface StoresState {
  stores: Store[];
  selectedStore: Store | null;
  storeHierarchy: StoreHierarchyNode[];
  storeInventory: StoreInventory | null;
  storeSummary: StoreSummary | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filters: StoresQueryParams;
}

const initialState: StoresState = {
  stores: [],
  selectedStore: null,
  storeHierarchy: [],
  storeInventory: null,
  storeSummary: null,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {}
};

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    // Fetch stores actions
    fetchStoresRequest: (state, action: PayloadAction<StoresQueryParams | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        state.filters = action.payload;
      }
    },
    fetchStoresSuccess: (state, action: PayloadAction<StoresListResponse>) => {
      state.isLoading = false;
      state.stores = action.payload.items;
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
    },
    fetchStoresFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch store by ID
    fetchStoreByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStoreByIdSuccess: (state, action: PayloadAction<Store>) => {
      state.isLoading = false;
      state.selectedStore = action.payload;
    },
    fetchStoreByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch store hierarchy
    fetchStoreHierarchyRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStoreHierarchySuccess: (state, action: PayloadAction<StoreHierarchyNode[]>) => {
      state.isLoading = false;
      state.storeHierarchy = action.payload;
    },
    fetchStoreHierarchyFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch store inventory
    fetchStoreInventoryRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStoreInventorySuccess: (state, action: PayloadAction<StoreInventory>) => {
      state.isLoading = false;
      state.storeInventory = action.payload;
    },
    fetchStoreInventoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch store summary
    fetchStoreSummaryRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStoreSummarySuccess: (state, action: PayloadAction<StoreSummary>) => {
      state.isLoading = false;
      state.storeSummary = action.payload;
    },
    fetchStoreSummaryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create store
    createStoreRequest: (state, action: PayloadAction<CreateStoreRequest>) => {
      state.isLoading = true;
      state.error = null;
    },
    createStoreSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
    },
    createStoreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update store
    updateStoreRequest: (state, action: PayloadAction<{ id: string; data: UpdateStoreRequest }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateStoreSuccess: (state) => {
      state.isLoading = false;
    },
    updateStoreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Activate/Deactivate store
    activateStoreRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    activateStoreSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      const store = state.stores.find(s => s.id === action.payload);
      if (store) store.isActive = true;
    },
    activateStoreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deactivateStoreRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deactivateStoreSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      const store = state.stores.find(s => s.id === action.payload);
      if (store) store.isActive = false;
    },
    deactivateStoreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Select store
    selectStore: (state, action: PayloadAction<Store | null>) => {
      state.selectedStore = action.payload;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<StoresQueryParams>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },

    // Set page
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear selected store
    clearSelectedStore: (state) => {
      state.selectedStore = null;
    }
  }
});

export const {
  fetchStoresRequest,
  fetchStoresSuccess,
  fetchStoresFailure,
  fetchStoreByIdRequest,
  fetchStoreByIdSuccess,
  fetchStoreByIdFailure,
  fetchStoreHierarchyRequest,
  fetchStoreHierarchySuccess,
  fetchStoreHierarchyFailure,
  fetchStoreInventoryRequest,
  fetchStoreInventorySuccess,
  fetchStoreInventoryFailure,
  fetchStoreSummaryRequest,
  fetchStoreSummarySuccess,
  fetchStoreSummaryFailure,
  createStoreRequest,
  createStoreSuccess,
  createStoreFailure,
  updateStoreRequest,
  updateStoreSuccess,
  updateStoreFailure,
  activateStoreRequest,
  activateStoreSuccess,
  activateStoreFailure,
  deactivateStoreRequest,
  deactivateStoreSuccess,
  deactivateStoreFailure,
  selectStore,
  setFilters,
  setPage,
  clearError,
  clearSelectedStore
} = storesSlice.actions;

export default storesSlice.reducer;
