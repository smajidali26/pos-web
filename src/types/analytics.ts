// Analytics Types

// Enums
export enum ForecastMethod {
  AUTO = 'AUTO',
  LINEAR = 'LINEAR',
  MOVING_AVERAGE = 'MOVING_AVERAGE',
  EXPONENTIAL = 'EXPONENTIAL'
}

export enum TurnoverClassification {
  FAST = 'FAST',
  NORMAL = 'NORMAL',
  SLOW = 'SLOW',
  DEAD = 'DEAD'
}

export enum ABCClass {
  A = 'A',
  B = 'B',
  C = 'C'
}

export enum GroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

// Real-time Dashboard Interfaces
export interface KPIMetric {
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  comparisonLabel: string;
}

export interface TopProduct {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  revenue: number;
}

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface HourlySales {
  hour: number;
  sales: number;
  orders: number;
}

export interface InventoryStatus {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockedItems: number;
}

export interface RealTimeDashboard {
  todaySales: KPIMetric;
  todayOrders: KPIMetric;
  todayCustomers: KPIMetric;
  avgOrderValue: KPIMetric;
  hourlySales: HourlySales[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  paymentMethods: PaymentMethodStats[];
  inventoryStatus: InventoryStatus;
  lastUpdated: string;
}

// Sales Analytics Interfaces
export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
}

export interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  previousPeriodSales: number;
  salesGrowth: number;
}

export interface SalesAnalytics {
  summary: SalesSummary;
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  paymentMethods: PaymentMethodStats[];
}

// Sales Forecast Interfaces
export interface ForecastDataPoint {
  date: string;
  historical?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface ForecastAccuracy {
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  r2: number; // R-squared
}

export interface SalesForecast {
  productId?: string;
  productName?: string;
  forecastData: ForecastDataPoint[];
  method: ForecastMethod;
  accuracy: ForecastAccuracy;
  forecastDays: number;
  generatedAt: string;
}

// Inventory Turnover Interfaces
export interface ProductTurnover {
  productId: string;
  productName: string;
  sku: string;
  categoryName: string;
  avgInventory: number;
  costOfGoodsSold: number;
  turnoverRatio: number;
  daysToSell: number;
  classification: TurnoverClassification;
  reorderRecommendation: string;
}

export interface InventoryTurnover {
  storeId?: string;
  storeName?: string;
  categoryId?: string;
  categoryName?: string;
  periodDays: number;
  averageTurnoverRatio: number;
  products: ProductTurnover[];
  summary: {
    fastMoving: number;
    normal: number;
    slowMoving: number;
    deadStock: number;
  };
}

// ABC Analysis Interfaces
export interface ABCProduct {
  productId: string;
  productName: string;
  sku: string;
  categoryName: string;
  revenue: number;
  revenuePercentage: number;
  cumulativePercentage: number;
  class: ABCClass;
  quantity: number;
}

export interface ABCClassSummary {
  class: ABCClass;
  productCount: number;
  revenuePercentage: number;
  totalRevenue: number;
  strategy: string;
}

export interface ABCAnalysis {
  storeId?: string;
  storeName?: string;
  periodDays: number;
  products: ABCProduct[];
  classSummaries: ABCClassSummary[];
  totalRevenue: number;
  generatedAt: string;
}

// Inventory Analytics Interfaces
export interface StockAgeDistribution {
  range: string;
  count: number;
  value: number;
}

export interface OverstockedItem {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  optimalStock: number;
  excessQuantity: number;
  tiedUpValue: number;
}

export interface SlowMovingItem {
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  lastSaleDate: string;
  daysWithoutSale: number;
  stockValue: number;
}

export interface ReorderRecommendation {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  recommendedOrderQty: number;
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  estimatedStockoutDate: string;
}

export interface InventoryAnalytics {
  storeId?: string;
  storeName?: string;
  totalInventoryValue: number;
  avgTurnoverRate: number;
  inventoryHealthScore: number;
  deadStockPercentage: number;
  carryingCost: number;
  stockAgeDistribution: StockAgeDistribution[];
  overstockedItems: OverstockedItem[];
  slowMovingItems: SlowMovingItem[];
  reorderRecommendations: ReorderRecommendation[];
}

// Request/Response Types
export interface GetSalesAnalyticsRequest {
  startDate: string;
  endDate: string;
  storeId?: string;
  groupBy: GroupBy;
}

export interface GetSalesForecastRequest {
  productId?: string;
  forecastDays: number;
  method: ForecastMethod;
}

export interface GetInventoryTurnoverRequest {
  storeId?: string;
  categoryId?: string;
  periodDays: number;
}

export interface GetABCAnalysisRequest {
  storeId?: string;
  periodDays: number;
}

export interface GenerateForecastRequest {
  productIds?: string[];
  forecastDays: number;
  method: ForecastMethod;
}

export interface CalculateABCAnalysisRequest {
  storeId?: string;
  periodDays: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface MultiSeriesDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}

// Filter Types
export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  groupBy?: GroupBy;
  periodDays?: number;
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'xlsx';
  filename?: string;
  includeCharts?: boolean;
}
