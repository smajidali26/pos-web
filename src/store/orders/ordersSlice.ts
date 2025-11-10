import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus, OrderStatistics } from '../../services/ordersService';

// Orders State Interface
export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  searchResults: Order[];
  recentOrders: Order[];
  todayOrders: Order[];
  statistics: OrderStatistics | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    customerId?: string;
  };
}

// Initial State
const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  searchResults: [],
  recentOrders: [],
  todayOrders: [],
  statistics: null,
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {}
};

// Orders Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Fetch orders
    fetchOrdersRequest: (state, action: PayloadAction<{
      page?: number;
      pageSize?: number;
      status?: OrderStatus;
      startDate?: string;
      endDate?: string;
      customerId?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload?.page) state.currentPage = action.payload.page;
      if (action.payload?.pageSize) state.pageSize = action.payload.pageSize;
      state.filters = {
        status: action.payload?.status,
        startDate: action.payload?.startDate,
        endDate: action.payload?.endDate,
        customerId: action.payload?.customerId
      };
    },
    fetchOrdersSuccess: (state, action: PayloadAction<{
      items: Order[];
      totalCount: number;
      totalPages: number;
      pageNumber: number;
    }>) => {
      state.orders = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.pageNumber;
      state.isLoading = false;
      state.error = null;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch order by ID
    fetchOrderByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrderByIdSuccess: (state, action: PayloadAction<Order>) => {
      state.selectedOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchOrderByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create order
    createOrderRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.selectedOrder = action.payload;
      state.totalCount += 1;
      state.isLoading = false;
      state.error = null;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Complete order
    completeOrderRequest: (state, action: PayloadAction<{ orderId: string; paymentInfo: any }>) => {
      state.isLoading = true;
      state.error = null;
    },
    completeOrderSuccess: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    completeOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Cancel order
    cancelOrderRequest: (state, action: PayloadAction<{ orderId: string; reason?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    cancelOrderSuccess: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    cancelOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Refund order
    refundOrderRequest: (state, action: PayloadAction<{ orderId: string; reason?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    refundOrderSuccess: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    refundOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Search orders
    searchOrdersRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.searchQuery = action.payload;
      state.error = null;
    },
    searchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.searchResults = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    searchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch today's orders
    fetchTodayOrdersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTodayOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.todayOrders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchTodayOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch recent orders
    fetchRecentOrdersRequest: (state, action: PayloadAction<number | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRecentOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.recentOrders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchRecentOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch statistics
    fetchStatisticsRequest: (state, action: PayloadAction<{
      startDate?: string;
      endDate?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatisticsSuccess: (state, action: PayloadAction<OrderStatistics>) => {
      state.statistics = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Select order
    selectOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },

    // Clear search
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },

    // Clear error
    clearErrorMessage: (state) => {
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
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    }
  }
});

// Export actions
export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderByIdRequest,
  fetchOrderByIdSuccess,
  fetchOrderByIdFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  completeOrderRequest,
  completeOrderSuccess,
  completeOrderFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFailure,
  refundOrderRequest,
  refundOrderSuccess,
  refundOrderFailure,
  searchOrdersRequest,
  searchOrdersSuccess,
  searchOrdersFailure,
  fetchTodayOrdersRequest,
  fetchTodayOrdersSuccess,
  fetchTodayOrdersFailure,
  fetchRecentOrdersRequest,
  fetchRecentOrdersSuccess,
  fetchRecentOrdersFailure,
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
  selectOrder,
  clearSearchResults,
  clearErrorMessage,
  setPage,
  setPageSize,
  clearFilters
} = ordersSlice.actions;

// Export reducer
export default ordersSlice.reducer;
