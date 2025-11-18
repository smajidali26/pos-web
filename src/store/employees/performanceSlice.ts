import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PerformanceMetric,
  MetricPeriodType,
  TopPerformer,
  PerformanceComparison,
  PerformanceTrend,
  CalculateMetricsRequest,
  UpdateCustomerRatingRequest
} from '../../services/performanceService';

export interface PerformanceState {
  metrics: PerformanceMetric[];
  selectedMetric: PerformanceMetric | null;
  topPerformers: TopPerformer[];
  comparisons: PerformanceComparison[];
  trends: PerformanceTrend[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    employeeProfileId?: string;
    periodType?: MetricPeriodType;
    startDate?: string;
    endDate?: string;
  };
}

const initialState: PerformanceState = {
  metrics: [],
  selectedMetric: null,
  topPerformers: [],
  comparisons: [],
  trends: [],
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: {}
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    // Fetch metrics by employee
    fetchMetricsByEmployeeRequest: (state, action: PayloadAction<{
      employeeId: string;
      periodType?: MetricPeriodType;
      startDate?: string;
      endDate?: string;
      page?: number;
      pageSize?: number;
    }>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.currentPage = action.payload.page;
      if (action.payload.pageSize) state.pageSize = action.payload.pageSize;
      if (action.payload.periodType !== undefined) state.filters.periodType = action.payload.periodType;
      if (action.payload.startDate !== undefined) state.filters.startDate = action.payload.startDate;
      if (action.payload.endDate !== undefined) state.filters.endDate = action.payload.endDate;
      state.filters.employeeProfileId = action.payload.employeeId;
    },

    fetchMetricsByEmployeeSuccess: (state, action: PayloadAction<{
      items: PerformanceMetric[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.metrics = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchMetricsByEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch metric by ID
    fetchMetricByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchMetricByIdSuccess: (state, action: PayloadAction<PerformanceMetric>) => {
      state.selectedMetric = action.payload;
      state.isLoading = false;
    },

    fetchMetricByIdFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch metrics by period
    fetchMetricsByPeriodRequest: (state, action: PayloadAction<{
      periodStart: string;
      periodEnd: string;
      periodType?: MetricPeriodType;
      employeeProfileId?: string;
      storeId?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchMetricsByPeriodSuccess: (state, action: PayloadAction<PerformanceMetric[]>) => {
      state.metrics = action.payload;
      state.isLoading = false;
    },

    fetchMetricsByPeriodFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch top performers
    fetchTopPerformersRequest: (state, action: PayloadAction<{
      periodStart: string;
      periodEnd: string;
      count?: number;
      storeId?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchTopPerformersSuccess: (state, action: PayloadAction<TopPerformer[]>) => {
      state.topPerformers = action.payload;
      state.isLoading = false;
    },

    fetchTopPerformersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch performance comparison
    fetchComparisonRequest: (state, action: PayloadAction<{
      employeeProfileIds: string[];
      periodStart: string;
      periodEnd: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchComparisonSuccess: (state, action: PayloadAction<PerformanceComparison[]>) => {
      state.comparisons = action.payload;
      state.isLoading = false;
    },

    fetchComparisonFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch performance trends
    fetchTrendsRequest: (state, action: PayloadAction<{
      employeeId: string;
      periodType: MetricPeriodType;
      periodsCount?: number;
      endDate?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchTrendsSuccess: (state, action: PayloadAction<PerformanceTrend[]>) => {
      state.trends = action.payload;
      state.isLoading = false;
    },

    fetchTrendsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Calculate metrics
    calculateMetricsRequest: (state, action: PayloadAction<CalculateMetricsRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    calculateMetricsSuccess: (state, action: PayloadAction<PerformanceMetric>) => {
      const index = state.metrics.findIndex(
        m => m.employeeProfileId === action.payload.employeeProfileId &&
             m.periodStart === action.payload.periodStart &&
             m.periodEnd === action.payload.periodEnd
      );
      if (index !== -1) {
        state.metrics[index] = action.payload;
      } else {
        state.metrics.unshift(action.payload);
      }
      state.isLoading = false;
    },

    calculateMetricsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update customer rating
    updateCustomerRatingRequest: (state, action: PayloadAction<UpdateCustomerRatingRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateCustomerRatingSuccess: (state, action: PayloadAction<PerformanceMetric>) => {
      const index = state.metrics.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.metrics[index] = action.payload;
      }
      if (state.selectedMetric?.id === action.payload.id) {
        state.selectedMetric = action.payload;
      }
      state.isLoading = false;
    },

    updateCustomerRatingFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Recalculate all metrics
    recalculateAllMetricsRequest: (state, action: PayloadAction<{
      periodStart: string;
      periodEnd: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    recalculateAllMetricsSuccess: (state) => {
      state.isLoading = false;
    },

    recalculateAllMetricsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Select metric
    selectMetric: (state, action: PayloadAction<PerformanceMetric | null>) => {
      state.selectedMetric = action.payload;
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
    setFilters: (state, action: PayloadAction<PerformanceState['filters']>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    // Clear trends
    clearTrends: (state) => {
      state.trends = [];
    },

    // Clear comparisons
    clearComparisons: (state) => {
      state.comparisons = [];
    }
  }
});

export const {
  fetchMetricsByEmployeeRequest,
  fetchMetricsByEmployeeSuccess,
  fetchMetricsByEmployeeFailure,
  fetchMetricByIdRequest,
  fetchMetricByIdSuccess,
  fetchMetricByIdFailure,
  fetchMetricsByPeriodRequest,
  fetchMetricsByPeriodSuccess,
  fetchMetricsByPeriodFailure,
  fetchTopPerformersRequest,
  fetchTopPerformersSuccess,
  fetchTopPerformersFailure,
  fetchComparisonRequest,
  fetchComparisonSuccess,
  fetchComparisonFailure,
  fetchTrendsRequest,
  fetchTrendsSuccess,
  fetchTrendsFailure,
  calculateMetricsRequest,
  calculateMetricsSuccess,
  calculateMetricsFailure,
  updateCustomerRatingRequest,
  updateCustomerRatingSuccess,
  updateCustomerRatingFailure,
  recalculateAllMetricsRequest,
  recalculateAllMetricsSuccess,
  recalculateAllMetricsFailure,
  selectMetric,
  clearError,
  setPage,
  setPageSize,
  setFilters,
  clearFilters,
  clearTrends,
  clearComparisons
} = performanceSlice.actions;

export default performanceSlice.reducer;
