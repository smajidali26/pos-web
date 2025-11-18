import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  InterStoreTransfer,
  TransfersListResponse,
  TransfersQueryParams,
  CreateTransferRequest,
  UpdateTransferRequest,
  RejectTransferRequest,
  CancelTransferRequest
} from '../../types/interStoreTransfer';

export interface TransfersState {
  transfers: InterStoreTransfer[];
  selectedTransfer: InterStoreTransfer | null;
  pendingTransfers: InterStoreTransfer[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filters: TransfersQueryParams;
}

const initialState: TransfersState = {
  transfers: [],
  selectedTransfer: null,
  pendingTransfers: [],
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {}
};

const transfersSlice = createSlice({
  name: 'interStoreTransfers',
  initialState,
  reducers: {
    // Fetch transfers actions
    fetchTransfersRequest: (state, action: PayloadAction<TransfersQueryParams | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        state.filters = action.payload;
      }
    },
    fetchTransfersSuccess: (state, action: PayloadAction<TransfersListResponse>) => {
      state.isLoading = false;
      state.transfers = action.payload.items;
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
    },
    fetchTransfersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch transfer by ID
    fetchTransferByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransferByIdSuccess: (state, action: PayloadAction<InterStoreTransfer>) => {
      state.isLoading = false;
      state.selectedTransfer = action.payload;
    },
    fetchTransferByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch pending transfers
    fetchPendingTransfersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPendingTransfersSuccess: (state, action: PayloadAction<InterStoreTransfer[]>) => {
      state.isLoading = false;
      state.pendingTransfers = action.payload;
    },
    fetchPendingTransfersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create transfer
    createTransferRequest: (state, action: PayloadAction<CreateTransferRequest>) => {
      state.isLoading = true;
      state.error = null;
    },
    createTransferSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
    },
    createTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update transfer
    updateTransferRequest: (state, action: PayloadAction<{ id: string; data: UpdateTransferRequest }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateTransferSuccess: (state) => {
      state.isLoading = false;
    },
    updateTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Submit transfer
    submitTransferRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    submitTransferSuccess: (state) => {
      state.isLoading = false;
    },
    submitTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Approve transfer
    approveTransferRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    approveTransferSuccess: (state) => {
      state.isLoading = false;
    },
    approveTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Reject transfer
    rejectTransferRequest: (state, action: PayloadAction<{ id: string; data: RejectTransferRequest }>) => {
      state.isLoading = true;
      state.error = null;
    },
    rejectTransferSuccess: (state) => {
      state.isLoading = false;
    },
    rejectTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Ship transfer
    shipTransferRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    shipTransferSuccess: (state) => {
      state.isLoading = false;
    },
    shipTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Complete transfer
    completeTransferRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    completeTransferSuccess: (state) => {
      state.isLoading = false;
    },
    completeTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Cancel transfer
    cancelTransferRequest: (state, action: PayloadAction<{ id: string; data: CancelTransferRequest }>) => {
      state.isLoading = true;
      state.error = null;
    },
    cancelTransferSuccess: (state) => {
      state.isLoading = false;
    },
    cancelTransferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Select transfer
    selectTransfer: (state, action: PayloadAction<InterStoreTransfer | null>) => {
      state.selectedTransfer = action.payload;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<TransfersQueryParams>) => {
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

    // Clear selected transfer
    clearSelectedTransfer: (state) => {
      state.selectedTransfer = null;
    }
  }
});

export const {
  fetchTransfersRequest,
  fetchTransfersSuccess,
  fetchTransfersFailure,
  fetchTransferByIdRequest,
  fetchTransferByIdSuccess,
  fetchTransferByIdFailure,
  fetchPendingTransfersRequest,
  fetchPendingTransfersSuccess,
  fetchPendingTransfersFailure,
  createTransferRequest,
  createTransferSuccess,
  createTransferFailure,
  updateTransferRequest,
  updateTransferSuccess,
  updateTransferFailure,
  submitTransferRequest,
  submitTransferSuccess,
  submitTransferFailure,
  approveTransferRequest,
  approveTransferSuccess,
  approveTransferFailure,
  rejectTransferRequest,
  rejectTransferSuccess,
  rejectTransferFailure,
  shipTransferRequest,
  shipTransferSuccess,
  shipTransferFailure,
  completeTransferRequest,
  completeTransferSuccess,
  completeTransferFailure,
  cancelTransferRequest,
  cancelTransferSuccess,
  cancelTransferFailure,
  selectTransfer,
  setFilters,
  setPage,
  clearError,
  clearSelectedTransfer
} = transfersSlice.actions;

export default transfersSlice.reducer;
