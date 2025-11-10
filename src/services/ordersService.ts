import apiClient from './apiClient';

// Order status enum
export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

// Payment method enum
export enum PaymentMethod {
  Cash = 'Cash',
  Card = 'Card',
  Mixed = 'Mixed'
}

// Order item interface
export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  categoryName?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  orderDate: string;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  cashAmount?: number;
  cardAmount?: number;
  changeAmount?: number;
  notes?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  cashierId?: string;
  cashierName?: string;
}

// Create order request
export interface CreateOrderRequest {
  customerId?: string;
  orderItems: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  paymentMethod: PaymentMethod;
  cashAmount?: number;
  cardAmount?: number;
  notes?: string;
}

// Complete order request (after payment)
export interface CompleteOrderRequest {
  paymentMethod: PaymentMethod;
  cashAmount?: number;
  cardAmount?: number;
  cardTransactionId?: string;
  notes?: string;
}

// Order list response with pagination
export interface OrderListResponse {
  items: Order[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Order statistics
export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
  weekOrders: number;
  weekRevenue: number;
  monthOrders: number;
  monthRevenue: number;
}

// Orders Service
const ordersService = {
  // Get all orders with pagination and filters
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    customerId?: string;
    searchTerm?: string;
  }) => {
    return apiClient.get<OrderListResponse>('/api/Orders', { params });
  },

  // Get order by ID
  getById: (id: string) => {
    return apiClient.get<Order>(`/api/Orders/${id}`);
  },

  // Create new order
  create: (order: CreateOrderRequest) => {
    return apiClient.post<Order>('/api/Orders', order);
  },

  // Complete order (after payment processing)
  complete: (orderId: string, paymentInfo: CompleteOrderRequest) => {
    return apiClient.post<Order>(`/api/Orders/${orderId}/complete`, paymentInfo);
  },

  // Cancel order
  cancel: (orderId: string, reason?: string) => {
    return apiClient.post<Order>(`/api/Orders/${orderId}/cancel`, { reason });
  },

  // Get today's orders
  getTodayOrders: () => {
    return apiClient.get<Order[]>('/api/Orders/today');
  },

  // Get orders by date range
  getByDateRange: (startDate: string, endDate: string) => {
    return apiClient.get<Order[]>('/api/Orders/daterange', {
      params: { startDate, endDate }
    });
  },

  // Get customer order history
  getCustomerOrders: (customerId: string, params?: {
    page?: number;
    pageSize?: number;
  }) => {
    return apiClient.get<OrderListResponse>(`/api/Orders/customer/${customerId}`, { params });
  },

  // Get order statistics
  getStatistics: (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return apiClient.get<OrderStatistics>('/api/Orders/statistics', { params });
  },

  // Get recent orders
  getRecent: (limit: number = 10) => {
    return apiClient.get<Order[]>('/api/Orders/recent', {
      params: { limit }
    });
  },

  // Search orders
  search: (query: string) => {
    return apiClient.get<Order[]>(`/api/Orders/search?q=${encodeURIComponent(query)}`);
  },

  // Refund order items (partial or full refund)
  refundItems: (orderId: string, items: Array<{ orderItemId: string; quantityToRefund: number }>, reason?: string) => {
    return apiClient.post(`/api/Orders/${orderId}/refund`, { items, reason });
  },

  // Update order notes
  updateNotes: (orderId: string, notes: string) => {
    return apiClient.patch<Order>(`/api/Orders/${orderId}/notes`, { notes });
  },

  // Get order receipt data
  getReceipt: (orderId: string) => {
    return apiClient.get<Order>(`/api/Orders/${orderId}/receipt`);
  },

  // Print order receipt (returns PDF or HTML)
  printReceipt: (orderId: string) => {
    return apiClient.get(`/api/Orders/${orderId}/print`, {
      responseType: 'blob'
    });
  }
};

export default ordersService;
