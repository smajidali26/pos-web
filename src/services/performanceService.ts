import apiClient from './apiClient';

// Enums
export enum MetricPeriodType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly'
}

// Interfaces
export interface PerformanceMetric {
  id: string;
  employeeProfileId: string;
  periodStart: string;
  periodEnd: string;
  periodType: MetricPeriodType;
  // Sales metrics
  totalSales: number;
  ordersProcessed: number;
  averageOrderValue: number;
  itemsSold: number;
  // Performance metrics
  commissionEarned?: number;
  refundsProcessed: number;
  refundAmount: number;
  refundRate: number;
  // Attendance metrics
  scheduledShifts: number;
  completedShifts: number;
  missedShifts: number;
  lateArrivals: number;
  totalHoursWorked: number;
  totalBreakHours: number;
  // Customer satisfaction
  customerRatingCount?: number;
  averageCustomerRating?: number;
  // Calculated score
  performanceScore: number;
  performanceGrade?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  employeeProfile?: {
    id: string;
    employeeCode: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CalculateMetricsRequest {
  employeeProfileId: string;
  periodStart: string;
  periodEnd: string;
  periodType: MetricPeriodType;
}

export interface UpdateCustomerRatingRequest {
  employeeProfileId: string;
  rating: number;
  orderId?: string;
}

export interface PerformanceListResponse {
  items: PerformanceMetric[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface TopPerformer {
  employeeProfileId: string;
  employeeCode: string;
  employeeName: string;
  performanceScore: number;
  performanceGrade: string;
  totalSales: number;
  ordersProcessed: number;
  averageOrderValue: number;
  rank: number;
}

export interface PerformanceComparison {
  employeeProfileId: string;
  employeeName: string;
  currentPeriod: PerformanceMetric;
  previousPeriod?: PerformanceMetric;
  percentageChange: {
    sales: number;
    orders: number;
    performance: number;
  };
}

export interface PerformanceTrend {
  period: string;
  performanceScore: number;
  totalSales: number;
  ordersProcessed: number;
  attendanceRate: number;
  averageCustomerRating?: number;
}

const performanceService = {
  /**
   * Get performance metrics for employee
   */
  getByEmployee: (employeeId: string, params?: {
    periodType?: MetricPeriodType;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) => apiClient.get<PerformanceListResponse>(
    `/api/performance/employee/${employeeId}`,
    { params }
  ),

  /**
   * Get performance metric by ID
   */
  getById: (id: string) =>
    apiClient.get<PerformanceMetric>(`/api/performance/${id}`),

  /**
   * Get performance metrics for a period
   */
  getByPeriod: (params: {
    periodStart: string;
    periodEnd: string;
    periodType?: MetricPeriodType;
    employeeProfileId?: string;
    storeId?: string;
  }) => apiClient.get<PerformanceMetric[]>('/api/performance/period', { params }),

  /**
   * Get top performers for a period
   */
  getTopPerformers: (params: {
    periodStart: string;
    periodEnd: string;
    count?: number;
    storeId?: string;
  }) => apiClient.get<TopPerformer[]>('/api/performance/top-performers', { params }),

  /**
   * Get performance comparison
   */
  getComparison: (params: {
    employeeProfileIds: string[];
    periodStart: string;
    periodEnd: string;
  }) => apiClient.get<PerformanceComparison[]>('/api/performance/comparison', { params }),

  /**
   * Get performance trends for employee
   */
  getTrends: (employeeId: string, params: {
    periodType: MetricPeriodType;
    periodsCount?: number;
    endDate?: string;
  }) => apiClient.get<PerformanceTrend[]>(
    `/api/performance/trends/${employeeId}`,
    { params }
  ),

  /**
   * Calculate performance metrics
   */
  calculate: (data: CalculateMetricsRequest) =>
    apiClient.post<PerformanceMetric>('/api/performance/calculate', data),

  /**
   * Update customer rating
   */
  updateCustomerRating: (data: UpdateCustomerRatingRequest) =>
    apiClient.post<PerformanceMetric>('/api/performance/customer-rating', data),

  /**
   * Recalculate all metrics
   */
  recalculateAll: (params: {
    periodStart: string;
    periodEnd: string;
  }) => apiClient.post('/api/performance/recalculate-all', null, { params }),

  /**
   * Get employee statistics summary
   */
  getStatistics: (employeeId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) => apiClient.get(`/api/performance/statistics/${employeeId}`, { params })
};

export default performanceService;
