import apiClient from './apiClient';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  loyaltyPoints?: number;
  totalPurchases?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface CustomerListResponse {
  items: Customer[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const customersService = {
  /**
   * Get all customers with optional pagination and filtering
   */
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
  }) => apiClient.get<CustomerListResponse>('/api/Customers', { params }),

  /**
   * Get customer by ID
   */
  getById: (id: string) =>
    apiClient.get<Customer>(`/api/Customers/${id}`),

  /**
   * Create new customer
   */
  create: (customer: CreateCustomerRequest) =>
    apiClient.post<Customer>('/api/Customers', customer),

  /**
   * Update existing customer
   */
  update: (id: string, customer: CreateCustomerRequest) =>
    apiClient.put<Customer>(`/api/Customers/${id}`, customer),

  /**
   * Delete customer (soft delete - sets isActive = false)
   */
  delete: (id: string) =>
    apiClient.delete(`/api/Customers/${id}`),

  /**
   * Search customers by name, email, or phone
   */
  search: (query: string) =>
    apiClient.get<Customer[]>(`/api/Customers/search?q=${encodeURIComponent(query)}`),

  /**
   * Get customer order history
   */
  getOrderHistory: (customerId: string, params?: {
    page?: number;
    pageSize?: number;
  }) => apiClient.get(`/api/Customers/${customerId}/orders`, { params }),

  /**
   * Add loyalty points to customer
   */
  addLoyaltyPoints: (customerId: string, points: number, reason?: string) =>
    apiClient.post(`/api/Customers/${customerId}/loyalty-points`, {
      points,
      reason
    }),

  /**
   * Redeem loyalty points
   */
  redeemLoyaltyPoints: (customerId: string, points: number) =>
    apiClient.post(`/api/Customers/${customerId}/redeem-points`, {
      points
    }),

  /**
   * Get customer statistics
   */
  getStatistics: (customerId: string) =>
    apiClient.get(`/api/Customers/${customerId}/statistics`)
};

export default customersService;
