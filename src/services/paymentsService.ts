import apiClient from './apiClient';
import { PaymentMethod } from './ordersService';

// Payment status enum
export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

// Payment interface
export interface Payment {
  id: string;
  orderId: string;
  orderNumber?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  cardLast4?: string;
  cardBrand?: string;
  cashReceived?: number;
  changeGiven?: number;
  notes?: string;
  createdAt: string;
  processedBy?: string;
  refundedAmount?: number;
  refundReason?: string;
}

// Create payment request
export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  cardToken?: string;
  notes?: string;
}

// Stripe payment intent
export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

// Create payment intent request
export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  customerId?: string;
  orderId?: string;
  description?: string;
}

// Refund payment request
export interface RefundPaymentRequest {
  paymentId: string;
  amount?: number; // If not provided, full refund
  reason?: string;
}

// Payment statistics
export interface PaymentStatistics {
  totalPayments: number;
  totalAmount: number;
  cashPayments: number;
  cashAmount: number;
  cardPayments: number;
  cardAmount: number;
  averageTransactionAmount: number;
  todayPayments: number;
  todayAmount: number;
}

// Payments Service
const paymentsService = {
  // Create a payment
  create: (payment: CreatePaymentRequest) => {
    return apiClient.post<Payment>('/api/Payments', payment);
  },

  // Get payment by ID
  getById: (id: string) => {
    return apiClient.get<Payment>(`/api/Payments/${id}`);
  },

  // Get payment by order ID
  getByOrderId: (orderId: string) => {
    return apiClient.get<Payment[]>(`/api/Payments/order/${orderId}`);
  },

  // Process cash payment
  processCashPayment: (request: {
    orderId: string;
    amount: number;
    cashReceived: number;
    notes?: string;
  }) => {
    return apiClient.post<Payment>('/api/Payments/cash', request);
  },

  // Create Stripe payment intent
  createPaymentIntent: (request: CreatePaymentIntentRequest) => {
    return apiClient.post<PaymentIntent>('/api/Payments/create-intent', request);
  },

  // Confirm card payment (after Stripe processing)
  confirmCardPayment: (request: {
    orderId: string;
    amount: number;
    paymentIntentId: string;
    cardLast4?: string;
    cardBrand?: string;
  }) => {
    return apiClient.post<Payment>('/api/Payments/card', request);
  },

  // Process refund
  refund: (request: RefundPaymentRequest) => {
    return apiClient.post<Payment>('/api/Payments/refund', request);
  },

  // Get all payments with filters
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    startDate?: string;
    endDate?: string;
  }) => {
    return apiClient.get<Payment[]>('/api/Payments', { params });
  },

  // Get today's payments
  getToday: () => {
    return apiClient.get<Payment[]>('/api/Payments/today');
  },

  // Get payment statistics
  getStatistics: (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return apiClient.get<PaymentStatistics>('/api/Payments/statistics', { params });
  },

  // Verify payment status (check with Stripe if card payment)
  verifyPayment: (paymentId: string) => {
    return apiClient.get<Payment>(`/api/Payments/${paymentId}/verify`);
  },

  // Get payment methods for customer (saved cards)
  getCustomerPaymentMethods: (customerId: string) => {
    return apiClient.get<any[]>(`/api/Payments/customer/${customerId}/methods`);
  },

  // Check if Stripe is configured
  checkStripeAvailability: () => {
    return apiClient.get<{ available: boolean; message?: string }>('/api/Payments/stripe-status');
  }
};

export default paymentsService;
