import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Commission,
  CommissionTransaction,
  CommissionStatus,
  CreateCommissionRequest,
  UpdateCommissionRequest,
  ProcessPaymentRequest,
  CommissionSummary
} from '../../services/commissionService';

export interface CommissionsState {
  commissions: Commission[];
  selectedCommission: Commission | null;
  transactions: CommissionTransaction[];
  pendingTransactions: CommissionTransaction[];
  summary: CommissionSummary | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  transactionsPage: number;
  transactionsPageSize: number;
  transactionsTotalCount: number;
  transactionsTotalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    isActive?: boolean;
    employeeProfileId?: string;
  };
  transactionFilters: {
    status?: CommissionStatus;
    startDate?: string;
    endDate?: string;
    employeeProfileId?: string;
  };
}

const initialState: CommissionsState = {
  commissions: [],
  selectedCommission: null,
  transactions: [],
  pendingTransactions: [],
  summary: null,
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  transactionsPage: 1,
  transactionsPageSize: 20,
  transactionsTotalCount: 0,
  transactionsTotalPages: 0,
  isLoading: false,
  error: null,
  filters: {},
  transactionFilters: {}
};

const commissionsSlice = createSlice({
  name: 'commissions',
  initialState,
  reducers: {
    // Fetch commissions
    fetchCommissionsRequest: (state, action: PayloadAction<{
      page?: number;
      pageSize?: number;
      isActive?: boolean;
      employeeProfileId?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        if (action.payload.page) state.currentPage = action.payload.page;
        if (action.payload.pageSize) state.pageSize = action.payload.pageSize;
        if (action.payload.isActive !== undefined) state.filters.isActive = action.payload.isActive;
        if (action.payload.employeeProfileId !== undefined) state.filters.employeeProfileId = action.payload.employeeProfileId;
      }
    },

    fetchCommissionsSuccess: (state, action: PayloadAction<{
      items: Commission[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.commissions = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchCommissionsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch commission by ID
    fetchCommissionByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchCommissionByIdSuccess: (state, action: PayloadAction<Commission>) => {
      state.selectedCommission = action.payload;
      state.isLoading = false;
    },

    fetchCommissionByIdFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch active commissions
    fetchActiveCommissionsRequest: (state, action: PayloadAction<{
      employeeProfileId?: string;
      role?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchActiveCommissionsSuccess: (state, action: PayloadAction<Commission[]>) => {
      state.commissions = action.payload;
      state.isLoading = false;
    },

    fetchActiveCommissionsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Select commission
    selectCommission: (state, action: PayloadAction<Commission | null>) => {
      state.selectedCommission = action.payload;
    },

    // Create commission
    createCommissionRequest: (state, action: PayloadAction<CreateCommissionRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    createCommissionSuccess: (state, action: PayloadAction<Commission>) => {
      state.commissions.unshift(action.payload);
      state.totalCount += 1;
      state.isLoading = false;
    },

    createCommissionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update commission
    updateCommissionRequest: (state, action: PayloadAction<{
      id: string;
      data: UpdateCommissionRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateCommissionSuccess: (state, action: PayloadAction<Commission>) => {
      const index = state.commissions.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.commissions[index] = action.payload;
      }
      if (state.selectedCommission?.id === action.payload.id) {
        state.selectedCommission = action.payload;
      }
      state.isLoading = false;
    },

    updateCommissionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Activate commission
    activateCommissionRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    activateCommissionSuccess: (state, action: PayloadAction<Commission>) => {
      const index = state.commissions.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.commissions[index] = action.payload;
      }
      if (state.selectedCommission?.id === action.payload.id) {
        state.selectedCommission = action.payload;
      }
      state.isLoading = false;
    },

    activateCommissionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Deactivate commission
    deactivateCommissionRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    deactivateCommissionSuccess: (state, action: PayloadAction<Commission>) => {
      const index = state.commissions.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.commissions[index] = action.payload;
      }
      if (state.selectedCommission?.id === action.payload.id) {
        state.selectedCommission = action.payload;
      }
      state.isLoading = false;
    },

    deactivateCommissionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Delete commission
    deleteCommissionRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteCommissionSuccess: (state, action: PayloadAction<string>) => {
      state.commissions = state.commissions.filter(c => c.id !== action.payload);
      state.totalCount -= 1;
      if (state.selectedCommission?.id === action.payload) {
        state.selectedCommission = null;
      }
      state.isLoading = false;
    },

    deleteCommissionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch transactions
    fetchTransactionsRequest: (state, action: PayloadAction<{
      employeeId: string;
      page?: number;
      pageSize?: number;
      status?: CommissionStatus;
      startDate?: string;
      endDate?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.transactionsPage = action.payload.page;
      if (action.payload.pageSize) state.transactionsPageSize = action.payload.pageSize;
      if (action.payload.status !== undefined) state.transactionFilters.status = action.payload.status;
      if (action.payload.startDate !== undefined) state.transactionFilters.startDate = action.payload.startDate;
      if (action.payload.endDate !== undefined) state.transactionFilters.endDate = action.payload.endDate;
      state.transactionFilters.employeeProfileId = action.payload.employeeId;
    },

    fetchTransactionsSuccess: (state, action: PayloadAction<{
      items: CommissionTransaction[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.transactions = action.payload.items;
      state.transactionsTotalCount = action.payload.totalCount;
      state.transactionsPage = action.payload.pageNumber;
      state.transactionsPageSize = action.payload.pageSize;
      state.transactionsTotalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch pending commissions
    fetchPendingCommissionsRequest: (state, action: PayloadAction<{
      page?: number;
      pageSize?: number;
      employeeProfileId?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchPendingCommissionsSuccess: (state, action: PayloadAction<{
      items: CommissionTransaction[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.pendingTransactions = action.payload.items;
      state.isLoading = false;
    },

    fetchPendingCommissionsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch commission summary
    fetchCommissionSummaryRequest: (state, action: PayloadAction<{
      employeeId: string;
      startDate?: string;
      endDate?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchCommissionSummarySuccess: (state, action: PayloadAction<CommissionSummary>) => {
      state.summary = action.payload;
      state.isLoading = false;
    },

    fetchCommissionSummaryFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Approve transaction
    approveTransactionRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    approveTransactionSuccess: (state, action: PayloadAction<CommissionTransaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      state.pendingTransactions = state.pendingTransactions.filter(t => t.id !== action.payload.id);
      state.isLoading = false;
    },

    approveTransactionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Void transaction
    voidTransactionRequest: (state, action: PayloadAction<{
      transactionId: string;
      reason?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    voidTransactionSuccess: (state, action: PayloadAction<CommissionTransaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      state.pendingTransactions = state.pendingTransactions.filter(t => t.id !== action.payload.id);
      state.isLoading = false;
    },

    voidTransactionFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Process payment
    processPaymentRequest: (state, action: PayloadAction<ProcessPaymentRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    processPaymentSuccess: (state, action: PayloadAction<CommissionTransaction[]>) => {
      action.payload.forEach(updated => {
        const index = state.transactions.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          state.transactions[index] = updated;
        }
      });
      state.isLoading = false;
    },

    processPaymentFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
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
      state.currentPage = 1;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<CommissionsState['filters']>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    }
  }
});

export const {
  fetchCommissionsRequest,
  fetchCommissionsSuccess,
  fetchCommissionsFailure,
  fetchCommissionByIdRequest,
  fetchCommissionByIdSuccess,
  fetchCommissionByIdFailure,
  fetchActiveCommissionsRequest,
  fetchActiveCommissionsSuccess,
  fetchActiveCommissionsFailure,
  selectCommission,
  createCommissionRequest,
  createCommissionSuccess,
  createCommissionFailure,
  updateCommissionRequest,
  updateCommissionSuccess,
  updateCommissionFailure,
  activateCommissionRequest,
  activateCommissionSuccess,
  activateCommissionFailure,
  deactivateCommissionRequest,
  deactivateCommissionSuccess,
  deactivateCommissionFailure,
  deleteCommissionRequest,
  deleteCommissionSuccess,
  deleteCommissionFailure,
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchPendingCommissionsRequest,
  fetchPendingCommissionsSuccess,
  fetchPendingCommissionsFailure,
  fetchCommissionSummaryRequest,
  fetchCommissionSummarySuccess,
  fetchCommissionSummaryFailure,
  approveTransactionRequest,
  approveTransactionSuccess,
  approveTransactionFailure,
  voidTransactionRequest,
  voidTransactionSuccess,
  voidTransactionFailure,
  processPaymentRequest,
  processPaymentSuccess,
  processPaymentFailure,
  clearError,
  setPage,
  setPageSize,
  setFilters,
  clearFilters
} = commissionsSlice.actions;

export default commissionsSlice.reducer;
