import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store';
import { Order, OrderStatus, CreateOrderRequest, CompleteOrderRequest } from '../services/ordersService';
import {
  fetchOrdersRequest,
  fetchOrderByIdRequest,
  createOrderRequest,
  completeOrderRequest,
  cancelOrderRequest,
  refundOrderRequest,
  searchOrdersRequest,
  fetchTodayOrdersRequest,
  fetchRecentOrdersRequest,
  fetchStatisticsRequest,
  selectOrder,
  clearSearchResults,
  clearErrorMessage,
  setPage,
  setPageSize,
  clearFilters
} from '../store/orders/ordersSlice';

export const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ordersState = useSelector((state: RootState) => state.orders);

  // Fetch orders with filters
  const fetchOrders = useCallback((params?: {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    customerId?: string;
  }) => {
    dispatch(fetchOrdersRequest(params));
  }, [dispatch]);

  // Fetch order by ID
  const fetchOrderById = useCallback((id: string) => {
    dispatch(fetchOrderByIdRequest(id));
  }, [dispatch]);

  // Create new order
  const createOrder = useCallback((orderData: CreateOrderRequest) => {
    dispatch(createOrderRequest(orderData));
  }, [dispatch]);

  // Complete order (after payment)
  const completeOrder = useCallback((orderId: string, paymentInfo: CompleteOrderRequest) => {
    dispatch(completeOrderRequest({ orderId, paymentInfo }));
  }, [dispatch]);

  // Cancel order
  const cancelOrder = useCallback((orderId: string, reason?: string) => {
    dispatch(cancelOrderRequest({ orderId, reason }));
  }, [dispatch]);

  // Refund order
  const refundOrder = useCallback((orderId: string, reason?: string) => {
    dispatch(refundOrderRequest({ orderId, reason }));
  }, [dispatch]);

  // Search orders
  const searchOrders = useCallback((query: string) => {
    dispatch(searchOrdersRequest(query));
  }, [dispatch]);

  // Fetch today's orders
  const fetchTodayOrders = useCallback(() => {
    dispatch(fetchTodayOrdersRequest());
  }, [dispatch]);

  // Fetch recent orders
  const fetchRecentOrders = useCallback((limit?: number) => {
    dispatch(fetchRecentOrdersRequest(limit));
  }, [dispatch]);

  // Fetch statistics
  const fetchStatistics = useCallback((params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    dispatch(fetchStatisticsRequest(params));
  }, [dispatch]);

  // Select order
  const selectOrderById = useCallback((order: Order | null) => {
    dispatch(selectOrder(order));
  }, [dispatch]);

  // Clear search results
  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  // Clear error message
  const clearError = useCallback(() => {
    dispatch(clearErrorMessage());
  }, [dispatch]);

  // Change page
  const changePage = useCallback((page: number) => {
    dispatch(setPage(page));
    dispatch(fetchOrdersRequest({ page, pageSize: ordersState.pageSize }));
  }, [dispatch, ordersState.pageSize]);

  // Change page size
  const changePageSize = useCallback((pageSize: number) => {
    dispatch(setPageSize(pageSize));
    dispatch(fetchOrdersRequest({ page: 1, pageSize }));
  }, [dispatch]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(fetchOrdersRequest({ page: 1 }));
  }, [dispatch]);

  return {
    // State
    orders: ordersState.orders,
    selectedOrder: ordersState.selectedOrder,
    searchResults: ordersState.searchResults,
    recentOrders: ordersState.recentOrders,
    todayOrders: ordersState.todayOrders,
    statistics: ordersState.statistics,
    currentPage: ordersState.currentPage,
    pageSize: ordersState.pageSize,
    totalCount: ordersState.totalCount,
    totalPages: ordersState.totalPages,
    isLoading: ordersState.isLoading,
    error: ordersState.error,
    searchQuery: ordersState.searchQuery,
    filters: ordersState.filters,

    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    completeOrder,
    cancelOrder,
    refundOrder,
    searchOrders,
    fetchTodayOrders,
    fetchRecentOrders,
    fetchStatistics,
    selectOrderById,
    clearSearch,
    clearError,
    changePage,
    changePageSize,
    clearAllFilters
  };
};

export default useOrders;
