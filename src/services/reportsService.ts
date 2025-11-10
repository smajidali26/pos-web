import apiClient from './apiClient';

// Report types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalTax: number;
  totalDiscount: number;
  grossSales: number;
  netSales: number;
  cashSales: number;
  cardSales: number;
}

export interface ProductSalesReport {
  productId: string;
  productName: string;
  category: string;
  quantitySold: number;
  totalRevenue: number;
  averagePrice: number;
  percentageOfTotal: number;
}

export interface CategorySalesReport {
  categoryId: string;
  categoryName: string;
  totalSales: number;
  totalOrders: number;
  quantitySold: number;
  percentageOfTotal: number;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastPurchaseDate: string;
  averageOrderValue: number;
}

export interface HourlySalesReport {
  hour: number;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface DailySalesReport extends SalesReport {
  date: string;
}

export interface WeeklySalesReport extends SalesReport {
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
}

export interface MonthlySalesReport extends SalesReport {
  month: number;
  year: number;
  monthName: string;
}

export interface SalesTrendData {
  date: string;
  sales: number;
  orders: number;
  customers: number;
}

// Reports Service
const reportsService = {
  // Daily sales report
  getDailySales: (date?: string) => {
    return apiClient.get<DailySalesReport>('/api/Reports/daily', {
      params: { date }
    });
  },

  // Weekly sales report
  getWeeklySales: (weekStart?: string, weekEnd?: string) => {
    return apiClient.get<WeeklySalesReport>('/api/Reports/weekly', {
      params: { weekStart, weekEnd }
    });
  },

  // Monthly sales report
  getMonthlySales: (month?: number, year?: number) => {
    return apiClient.get<MonthlySalesReport>('/api/Reports/monthly', {
      params: { month, year }
    });
  },

  // Sales by date range
  getSalesByDateRange: (startDate: string, endDate: string) => {
    return apiClient.get<SalesReport>('/api/Reports/date-range', {
      params: { startDate, endDate }
    });
  },

  // Top products
  getTopProducts: (limit: number = 10, startDate?: string, endDate?: string) => {
    return apiClient.get<ProductSalesReport[]>('/api/Reports/top-products', {
      params: { limit, startDate, endDate }
    });
  },

  // Product sales breakdown
  getProductSales: (productId?: string, startDate?: string, endDate?: string) => {
    return apiClient.get<ProductSalesReport[]>('/api/Reports/product-sales', {
      params: { productId, startDate, endDate }
    });
  },

  // Category sales
  getCategorySales: (startDate?: string, endDate?: string) => {
    return apiClient.get<CategorySalesReport[]>('/api/Reports/category-sales', {
      params: { startDate, endDate }
    });
  },

  // Top customers
  getTopCustomers: (limit: number = 10, startDate?: string, endDate?: string) => {
    return apiClient.get<CustomerReport[]>('/api/Reports/top-customers', {
      params: { limit, startDate, endDate }
    });
  },

  // Customer spending report
  getCustomerReport: (customerId: string, startDate?: string, endDate?: string) => {
    return apiClient.get<CustomerReport>(`/api/Reports/customer/${customerId}`, {
      params: { startDate, endDate }
    });
  },

  // Hourly sales (for today or specific date)
  getHourlySales: (date?: string) => {
    return apiClient.get<HourlySalesReport[]>('/api/Reports/hourly', {
      params: { date }
    });
  },

  // Sales trend over time
  getSalesTrend: (startDate: string, endDate: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    return apiClient.get<SalesTrendData[]>('/api/Reports/sales-trend', {
      params: { startDate, endDate, interval }
    });
  },

  // Export reports to CSV/Excel
  exportReport: (reportType: string, startDate?: string, endDate?: string) => {
    return apiClient.get(`/api/Reports/export/${reportType}`, {
      params: { startDate, endDate },
      responseType: 'blob'
    });
  },

  // Summary statistics
  getSummaryStats: (startDate?: string, endDate?: string) => {
    return apiClient.get<{
      totalSales: number;
      totalOrders: number;
      totalCustomers: number;
      averageOrderValue: number;
      topSellingProduct: string;
      topCustomer: string;
    }>('/api/Reports/summary', {
      params: { startDate, endDate }
    });
  }
};

export default reportsService;
