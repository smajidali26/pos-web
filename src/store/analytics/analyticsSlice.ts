import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  RealTimeDashboard,
  SalesAnalytics,
  SalesForecast,
  InventoryTurnover,
  ABCAnalysis,
  InventoryAnalytics,
  SlowMovingItem,
  ReorderRecommendation,
  GetSalesAnalyticsRequest,
  GetSalesForecastRequest,
  GetInventoryTurnoverRequest,
  GetABCAnalysisRequest,
  GenerateForecastRequest,
  CalculateABCAnalysisRequest
} from '../../types/analytics';

// State interface
export interface AnalyticsState {
  // Dashboard data
  dashboard: RealTimeDashboard | null;
  dashboardLoading: boolean;
  dashboardError: string | null;

  // Sales analytics
  salesAnalytics: SalesAnalytics | null;
  salesAnalyticsLoading: boolean;
  salesAnalyticsError: string | null;

  // Sales forecasts
  forecasts: SalesForecast[];
  forecastsLoading: boolean;
  forecastsError: string | null;

  // Inventory turnover
  turnover: InventoryTurnover | null;
  turnoverLoading: boolean;
  turnoverError: string | null;

  // ABC analysis
  abcAnalysis: ABCAnalysis | null;
  abcAnalysisLoading: boolean;
  abcAnalysisError: string | null;

  // Inventory analytics
  inventoryAnalytics: InventoryAnalytics | null;
  inventoryAnalyticsLoading: boolean;
  inventoryAnalyticsError: string | null;

  // Slow-moving stock
  slowMovingStock: SlowMovingItem[];
  slowMovingStockLoading: boolean;
  slowMovingStockError: string | null;

  // Reorder recommendations
  reorderRecommendations: ReorderRecommendation[];
  reorderRecommendationsLoading: boolean;
  reorderRecommendationsError: string | null;

  // General loading state
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AnalyticsState = {
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,

  salesAnalytics: null,
  salesAnalyticsLoading: false,
  salesAnalyticsError: null,

  forecasts: [],
  forecastsLoading: false,
  forecastsError: null,

  turnover: null,
  turnoverLoading: false,
  turnoverError: null,

  abcAnalysis: null,
  abcAnalysisLoading: false,
  abcAnalysisError: null,

  inventoryAnalytics: null,
  inventoryAnalyticsLoading: false,
  inventoryAnalyticsError: null,

  slowMovingStock: [],
  slowMovingStockLoading: false,
  slowMovingStockError: null,

  reorderRecommendations: [],
  reorderRecommendationsLoading: false,
  reorderRecommendationsError: null,

  loading: false,
  error: null,
};

// Create slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Dashboard actions
    fetchDashboardRequest(state) {
      state.dashboardLoading = true;
      state.dashboardError = null;
    },
    fetchDashboardSuccess(state, action: PayloadAction<RealTimeDashboard>) {
      state.dashboardLoading = false;
      state.dashboard = action.payload;
      state.dashboardError = null;
    },
    fetchDashboardFailure(state, action: PayloadAction<string>) {
      state.dashboardLoading = false;
      state.dashboardError = action.payload;
    },

    // Sales analytics actions
    fetchSalesAnalyticsRequest(state, _action: PayloadAction<GetSalesAnalyticsRequest>) {
      state.salesAnalyticsLoading = true;
      state.salesAnalyticsError = null;
    },
    fetchSalesAnalyticsSuccess(state, action: PayloadAction<SalesAnalytics>) {
      state.salesAnalyticsLoading = false;
      state.salesAnalytics = action.payload;
      state.salesAnalyticsError = null;
    },
    fetchSalesAnalyticsFailure(state, action: PayloadAction<string>) {
      state.salesAnalyticsLoading = false;
      state.salesAnalyticsError = action.payload;
    },

    // Sales forecast actions
    fetchSalesForecastRequest(state, _action: PayloadAction<GetSalesForecastRequest>) {
      state.forecastsLoading = true;
      state.forecastsError = null;
    },
    fetchSalesForecastSuccess(state, action: PayloadAction<SalesForecast>) {
      state.forecastsLoading = false;
      // Add or update forecast in array
      const index = state.forecasts.findIndex(
        f => f.productId === action.payload.productId
      );
      if (index >= 0) {
        state.forecasts[index] = action.payload;
      } else {
        state.forecasts.push(action.payload);
      }
      state.forecastsError = null;
    },
    fetchSalesForecastFailure(state, action: PayloadAction<string>) {
      state.forecastsLoading = false;
      state.forecastsError = action.payload;
    },

    // Generate forecasts actions
    generateForecastsRequest(state, _action: PayloadAction<GenerateForecastRequest>) {
      state.forecastsLoading = true;
      state.forecastsError = null;
    },
    generateForecastsSuccess(state, action: PayloadAction<SalesForecast[]>) {
      state.forecastsLoading = false;
      state.forecasts = action.payload;
      state.forecastsError = null;
    },
    generateForecastsFailure(state, action: PayloadAction<string>) {
      state.forecastsLoading = false;
      state.forecastsError = action.payload;
    },

    // Inventory turnover actions
    fetchInventoryTurnoverRequest(state, _action: PayloadAction<GetInventoryTurnoverRequest>) {
      state.turnoverLoading = true;
      state.turnoverError = null;
    },
    fetchInventoryTurnoverSuccess(state, action: PayloadAction<InventoryTurnover>) {
      state.turnoverLoading = false;
      state.turnover = action.payload;
      state.turnoverError = null;
    },
    fetchInventoryTurnoverFailure(state, action: PayloadAction<string>) {
      state.turnoverLoading = false;
      state.turnoverError = action.payload;
    },

    // ABC analysis actions
    fetchABCAnalysisRequest(state, _action: PayloadAction<GetABCAnalysisRequest>) {
      state.abcAnalysisLoading = true;
      state.abcAnalysisError = null;
    },
    fetchABCAnalysisSuccess(state, action: PayloadAction<ABCAnalysis>) {
      state.abcAnalysisLoading = false;
      state.abcAnalysis = action.payload;
      state.abcAnalysisError = null;
    },
    fetchABCAnalysisFailure(state, action: PayloadAction<string>) {
      state.abcAnalysisLoading = false;
      state.abcAnalysisError = action.payload;
    },

    // Calculate ABC analysis actions
    calculateABCAnalysisRequest(state, _action: PayloadAction<CalculateABCAnalysisRequest>) {
      state.abcAnalysisLoading = true;
      state.abcAnalysisError = null;
    },
    calculateABCAnalysisSuccess(state, action: PayloadAction<ABCAnalysis>) {
      state.abcAnalysisLoading = false;
      state.abcAnalysis = action.payload;
      state.abcAnalysisError = null;
    },
    calculateABCAnalysisFailure(state, action: PayloadAction<string>) {
      state.abcAnalysisLoading = false;
      state.abcAnalysisError = action.payload;
    },

    // Inventory analytics actions
    fetchInventoryAnalyticsRequest(state, _action: PayloadAction<string | undefined>) {
      state.inventoryAnalyticsLoading = true;
      state.inventoryAnalyticsError = null;
    },
    fetchInventoryAnalyticsSuccess(state, action: PayloadAction<InventoryAnalytics>) {
      state.inventoryAnalyticsLoading = false;
      state.inventoryAnalytics = action.payload;
      state.inventoryAnalyticsError = null;
    },
    fetchInventoryAnalyticsFailure(state, action: PayloadAction<string>) {
      state.inventoryAnalyticsLoading = false;
      state.inventoryAnalyticsError = action.payload;
    },

    // Slow-moving stock actions
    fetchSlowMovingStockRequest(state, _action: PayloadAction<string | undefined>) {
      state.slowMovingStockLoading = true;
      state.slowMovingStockError = null;
    },
    fetchSlowMovingStockSuccess(state, action: PayloadAction<SlowMovingItem[]>) {
      state.slowMovingStockLoading = false;
      state.slowMovingStock = action.payload;
      state.slowMovingStockError = null;
    },
    fetchSlowMovingStockFailure(state, action: PayloadAction<string>) {
      state.slowMovingStockLoading = false;
      state.slowMovingStockError = action.payload;
    },

    // Reorder recommendations actions
    fetchReorderRecommendationsRequest(state, _action: PayloadAction<string | undefined>) {
      state.reorderRecommendationsLoading = true;
      state.reorderRecommendationsError = null;
    },
    fetchReorderRecommendationsSuccess(state, action: PayloadAction<ReorderRecommendation[]>) {
      state.reorderRecommendationsLoading = false;
      state.reorderRecommendations = action.payload;
      state.reorderRecommendationsError = null;
    },
    fetchReorderRecommendationsFailure(state, action: PayloadAction<string>) {
      state.reorderRecommendationsLoading = false;
      state.reorderRecommendationsError = action.payload;
    },

    // Clear actions
    clearDashboard(state) {
      state.dashboard = null;
      state.dashboardError = null;
    },
    clearSalesAnalytics(state) {
      state.salesAnalytics = null;
      state.salesAnalyticsError = null;
    },
    clearForecasts(state) {
      state.forecasts = [];
      state.forecastsError = null;
    },
    clearTurnover(state) {
      state.turnover = null;
      state.turnoverError = null;
    },
    clearABCAnalysis(state) {
      state.abcAnalysis = null;
      state.abcAnalysisError = null;
    },
    clearInventoryAnalytics(state) {
      state.inventoryAnalytics = null;
      state.inventoryAnalyticsError = null;
    },
    clearAll(state) {
      return initialState;
    },
  },
});

// Export actions
export const {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  fetchSalesAnalyticsRequest,
  fetchSalesAnalyticsSuccess,
  fetchSalesAnalyticsFailure,
  fetchSalesForecastRequest,
  fetchSalesForecastSuccess,
  fetchSalesForecastFailure,
  generateForecastsRequest,
  generateForecastsSuccess,
  generateForecastsFailure,
  fetchInventoryTurnoverRequest,
  fetchInventoryTurnoverSuccess,
  fetchInventoryTurnoverFailure,
  fetchABCAnalysisRequest,
  fetchABCAnalysisSuccess,
  fetchABCAnalysisFailure,
  calculateABCAnalysisRequest,
  calculateABCAnalysisSuccess,
  calculateABCAnalysisFailure,
  fetchInventoryAnalyticsRequest,
  fetchInventoryAnalyticsSuccess,
  fetchInventoryAnalyticsFailure,
  fetchSlowMovingStockRequest,
  fetchSlowMovingStockSuccess,
  fetchSlowMovingStockFailure,
  fetchReorderRecommendationsRequest,
  fetchReorderRecommendationsSuccess,
  fetchReorderRecommendationsFailure,
  clearDashboard,
  clearSalesAnalytics,
  clearForecasts,
  clearTurnover,
  clearABCAnalysis,
  clearInventoryAnalytics,
  clearAll,
} = analyticsSlice.actions;

// Export reducer
export default analyticsSlice.reducer;
