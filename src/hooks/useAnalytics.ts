import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchDashboardRequest,
  fetchSalesAnalyticsRequest,
  fetchSalesForecastRequest,
  generateForecastsRequest,
  fetchInventoryTurnoverRequest,
  fetchABCAnalysisRequest,
  calculateABCAnalysisRequest,
  fetchInventoryAnalyticsRequest,
  fetchSlowMovingStockRequest,
  fetchReorderRecommendationsRequest,
  clearDashboard,
  clearSalesAnalytics,
  clearForecasts,
  clearTurnover,
  clearABCAnalysis,
  clearInventoryAnalytics,
  clearAll,
} from '../store/analytics/analyticsSlice';
import type {
  GetSalesAnalyticsRequest,
  GetSalesForecastRequest,
  GetInventoryTurnoverRequest,
  GetABCAnalysisRequest,
  GenerateForecastRequest,
  CalculateABCAnalysisRequest,
} from '../types/analytics';

/**
 * Custom hook for analytics operations
 * Provides access to analytics data and operations
 */
export const useAnalytics = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select analytics state
  const analyticsState = useSelector((state: RootState) => state.analytics);

  // Dashboard operations
  const fetchDashboard = useCallback(() => {
    dispatch(fetchDashboardRequest());
  }, [dispatch]);

  // Sales analytics operations
  const fetchSalesAnalytics = useCallback((params: GetSalesAnalyticsRequest) => {
    dispatch(fetchSalesAnalyticsRequest(params));
  }, [dispatch]);

  // Sales forecast operations
  const fetchSalesForecast = useCallback((params: GetSalesForecastRequest) => {
    dispatch(fetchSalesForecastRequest(params));
  }, [dispatch]);

  const generateForecasts = useCallback((params: GenerateForecastRequest) => {
    dispatch(generateForecastsRequest(params));
  }, [dispatch]);

  // Inventory turnover operations
  const fetchInventoryTurnover = useCallback((params: GetInventoryTurnoverRequest) => {
    dispatch(fetchInventoryTurnoverRequest(params));
  }, [dispatch]);

  // ABC analysis operations
  const fetchABCAnalysis = useCallback((params: GetABCAnalysisRequest) => {
    dispatch(fetchABCAnalysisRequest(params));
  }, [dispatch]);

  const calculateABCAnalysis = useCallback((params: CalculateABCAnalysisRequest) => {
    dispatch(calculateABCAnalysisRequest(params));
  }, [dispatch]);

  // Inventory analytics operations
  const fetchInventoryAnalytics = useCallback((storeId?: string) => {
    dispatch(fetchInventoryAnalyticsRequest(storeId));
  }, [dispatch]);

  const fetchSlowMovingStock = useCallback((storeId?: string) => {
    dispatch(fetchSlowMovingStockRequest(storeId));
  }, [dispatch]);

  const fetchReorderRecommendations = useCallback((storeId?: string) => {
    dispatch(fetchReorderRecommendationsRequest(storeId));
  }, [dispatch]);

  // Clear operations
  const clearDashboardData = useCallback(() => {
    dispatch(clearDashboard());
  }, [dispatch]);

  const clearSalesAnalyticsData = useCallback(() => {
    dispatch(clearSalesAnalytics());
  }, [dispatch]);

  const clearForecastsData = useCallback(() => {
    dispatch(clearForecasts());
  }, [dispatch]);

  const clearTurnoverData = useCallback(() => {
    dispatch(clearTurnover());
  }, [dispatch]);

  const clearABCAnalysisData = useCallback(() => {
    dispatch(clearABCAnalysis());
  }, [dispatch]);

  const clearInventoryAnalyticsData = useCallback(() => {
    dispatch(clearInventoryAnalytics());
  }, [dispatch]);

  const clearAllAnalytics = useCallback(() => {
    dispatch(clearAll());
  }, [dispatch]);

  return {
    // State
    dashboard: analyticsState.dashboard,
    dashboardLoading: analyticsState.dashboardLoading,
    dashboardError: analyticsState.dashboardError,

    salesAnalytics: analyticsState.salesAnalytics,
    salesAnalyticsLoading: analyticsState.salesAnalyticsLoading,
    salesAnalyticsError: analyticsState.salesAnalyticsError,

    forecasts: analyticsState.forecasts,
    forecastsLoading: analyticsState.forecastsLoading,
    forecastsError: analyticsState.forecastsError,

    turnover: analyticsState.turnover,
    turnoverLoading: analyticsState.turnoverLoading,
    turnoverError: analyticsState.turnoverError,

    abcAnalysis: analyticsState.abcAnalysis,
    abcAnalysisLoading: analyticsState.abcAnalysisLoading,
    abcAnalysisError: analyticsState.abcAnalysisError,

    inventoryAnalytics: analyticsState.inventoryAnalytics,
    inventoryAnalyticsLoading: analyticsState.inventoryAnalyticsLoading,
    inventoryAnalyticsError: analyticsState.inventoryAnalyticsError,

    slowMovingStock: analyticsState.slowMovingStock,
    slowMovingStockLoading: analyticsState.slowMovingStockLoading,
    slowMovingStockError: analyticsState.slowMovingStockError,

    reorderRecommendations: analyticsState.reorderRecommendations,
    reorderRecommendationsLoading: analyticsState.reorderRecommendationsLoading,
    reorderRecommendationsError: analyticsState.reorderRecommendationsError,

    loading: analyticsState.loading,
    error: analyticsState.error,

    // Operations
    fetchDashboard,
    fetchSalesAnalytics,
    fetchSalesForecast,
    generateForecasts,
    fetchInventoryTurnover,
    fetchABCAnalysis,
    calculateABCAnalysis,
    fetchInventoryAnalytics,
    fetchSlowMovingStock,
    fetchReorderRecommendations,

    // Clear operations
    clearDashboardData,
    clearSalesAnalyticsData,
    clearForecastsData,
    clearTurnoverData,
    clearABCAnalysisData,
    clearInventoryAnalyticsData,
    clearAllAnalytics,
  };
};

export default useAnalytics;
