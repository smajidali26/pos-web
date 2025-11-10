import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SalesReport,
  ProductSalesReport,
  CategorySalesReport,
  CustomerReport,
  HourlySalesReport,
  SalesTrendData
} from '../../services/reportsService';

export interface ReportsState {
  dailySales: SalesReport | null;
  weeklySales: SalesReport | null;
  monthlySales: SalesReport | null;
  topProducts: ProductSalesReport[];
  categorySales: CategorySalesReport[];
  topCustomers: CustomerReport[];
  hourlySales: HourlySalesReport[];
  salesTrend: SalesTrendData[];
  summaryStats: any | null;
  isLoading: boolean;
  error: string | null;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

const initialState: ReportsState = {
  dailySales: null,
  weeklySales: null,
  monthlySales: null,
  topProducts: [],
  categorySales: [],
  topCustomers: [],
  hourlySales: [],
  salesTrend: [],
  summaryStats: null,
  isLoading: false,
  error: null,
  dateRange: {
    startDate: null,
    endDate: null
  }
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Daily sales
    fetchDailySalesRequest: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDailySalesSuccess: (state, action: PayloadAction<SalesReport>) => {
      state.dailySales = action.payload;
      state.isLoading = false;
    },
    fetchDailySalesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Weekly sales
    fetchWeeklySalesRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchWeeklySalesSuccess: (state, action: PayloadAction<SalesReport>) => {
      state.weeklySales = action.payload;
      state.isLoading = false;
    },
    fetchWeeklySalesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Monthly sales
    fetchMonthlySalesRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMonthlySalesSuccess: (state, action: PayloadAction<SalesReport>) => {
      state.monthlySales = action.payload;
      state.isLoading = false;
    },
    fetchMonthlySalesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Top products
    fetchTopProductsRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTopProductsSuccess: (state, action: PayloadAction<ProductSalesReport[]>) => {
      state.topProducts = action.payload;
      state.isLoading = false;
    },
    fetchTopProductsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Category sales
    fetchCategorySalesRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategorySalesSuccess: (state, action: PayloadAction<CategorySalesReport[]>) => {
      state.categorySales = action.payload;
      state.isLoading = false;
    },
    fetchCategorySalesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Top customers
    fetchTopCustomersRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTopCustomersSuccess: (state, action: PayloadAction<CustomerReport[]>) => {
      state.topCustomers = action.payload;
      state.isLoading = false;
    },
    fetchTopCustomersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Hourly sales
    fetchHourlySalesRequest: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchHourlySalesSuccess: (state, action: PayloadAction<HourlySalesReport[]>) => {
      state.hourlySales = action.payload;
      state.isLoading = false;
    },
    fetchHourlySalesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Sales trend
    fetchSalesTrendRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSalesTrendSuccess: (state, action: PayloadAction<SalesTrendData[]>) => {
      state.salesTrend = action.payload;
      state.isLoading = false;
    },
    fetchSalesTrendFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Summary stats
    fetchSummaryStatsRequest: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSummaryStatsSuccess: (state, action: PayloadAction<any>) => {
      state.summaryStats = action.payload;
      state.isLoading = false;
    },
    fetchSummaryStatsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set date range
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.dateRange = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  fetchDailySalesRequest,
  fetchDailySalesSuccess,
  fetchDailySalesFailure,
  fetchWeeklySalesRequest,
  fetchWeeklySalesSuccess,
  fetchWeeklySalesFailure,
  fetchMonthlySalesRequest,
  fetchMonthlySalesSuccess,
  fetchMonthlySalesFailure,
  fetchTopProductsRequest,
  fetchTopProductsSuccess,
  fetchTopProductsFailure,
  fetchCategorySalesRequest,
  fetchCategorySalesSuccess,
  fetchCategorySalesFailure,
  fetchTopCustomersRequest,
  fetchTopCustomersSuccess,
  fetchTopCustomersFailure,
  fetchHourlySalesRequest,
  fetchHourlySalesSuccess,
  fetchHourlySalesFailure,
  fetchSalesTrendRequest,
  fetchSalesTrendSuccess,
  fetchSalesTrendFailure,
  fetchSummaryStatsRequest,
  fetchSummaryStatsSuccess,
  fetchSummaryStatsFailure,
  setDateRange,
  clearError
} = reportsSlice.actions;

export default reportsSlice.reducer;
