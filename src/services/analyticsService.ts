import apiClient from './apiClient';
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
  CalculateABCAnalysisRequest,
  ApiResponse
} from '../types/analytics';

const API_PREFIX = '/api/analytics';

/**
 * Analytics Service
 * Handles all analytics-related API calls
 */
class AnalyticsService {
  /**
   * Get real-time dashboard data
   */
  async getRealTimeDashboard(): Promise<RealTimeDashboard> {
    const response = await apiClient.get<ApiResponse<RealTimeDashboard>>(
      `${API_PREFIX}/dashboard/realtime`
    );
    return response.data.data;
  }

  /**
   * Get sales analytics for a date range
   */
  async getSalesAnalytics(params: GetSalesAnalyticsRequest): Promise<SalesAnalytics> {
    const response = await apiClient.get<ApiResponse<SalesAnalytics>>(
      `${API_PREFIX}/sales`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get sales forecast
   */
  async getSalesForecast(params: GetSalesForecastRequest): Promise<SalesForecast> {
    const response = await apiClient.get<ApiResponse<SalesForecast>>(
      `${API_PREFIX}/sales/forecast`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Generate sales forecasts (batch)
   */
  async generateSalesForecast(data: GenerateForecastRequest): Promise<SalesForecast[]> {
    const response = await apiClient.post<ApiResponse<SalesForecast[]>>(
      `${API_PREFIX}/sales/forecast/generate`,
      data
    );
    return response.data.data;
  }

  /**
   * Get inventory turnover analysis
   */
  async getInventoryTurnover(params: GetInventoryTurnoverRequest): Promise<InventoryTurnover> {
    const response = await apiClient.get<ApiResponse<InventoryTurnover>>(
      `${API_PREFIX}/inventory/turnover`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get ABC analysis
   */
  async getABCAnalysis(params: GetABCAnalysisRequest): Promise<ABCAnalysis> {
    const response = await apiClient.get<ApiResponse<ABCAnalysis>>(
      `${API_PREFIX}/inventory/abc-analysis`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Calculate ABC analysis
   */
  async calculateABCAnalysis(data: CalculateABCAnalysisRequest): Promise<ABCAnalysis> {
    const response = await apiClient.post<ApiResponse<ABCAnalysis>>(
      `${API_PREFIX}/inventory/abc-analysis/calculate`,
      data
    );
    return response.data.data;
  }

  /**
   * Get inventory analytics
   */
  async getInventoryAnalytics(storeId?: string): Promise<InventoryAnalytics> {
    const response = await apiClient.get<ApiResponse<InventoryAnalytics>>(
      `${API_PREFIX}/inventory/analytics`,
      { params: { storeId } }
    );
    return response.data.data;
  }

  /**
   * Get slow-moving stock items
   */
  async getSlowMovingStock(storeId?: string): Promise<SlowMovingItem[]> {
    const response = await apiClient.get<ApiResponse<SlowMovingItem[]>>(
      `${API_PREFIX}/inventory/slow-moving`,
      { params: { storeId } }
    );
    return response.data.data;
  }

  /**
   * Get reorder recommendations
   */
  async getReorderRecommendations(storeId?: string): Promise<ReorderRecommendation[]> {
    const response = await apiClient.get<ApiResponse<ReorderRecommendation[]>>(
      `${API_PREFIX}/inventory/reorder-recommendations`,
      { params: { storeId } }
    );
    return response.data.data;
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(
    type: 'sales' | 'inventory' | 'forecast' | 'abc',
    format: 'csv' | 'pdf',
    params?: Record<string, unknown>
  ): Promise<Blob> {
    const response = await apiClient.get(
      `${API_PREFIX}/export/${type}`,
      {
        params: { ...params, format },
        responseType: 'blob'
      }
    );
    return response.data;
  }
}

export default new AnalyticsService();
