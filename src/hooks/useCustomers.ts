import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  fetchCustomersRequest,
  searchCustomersRequest,
  selectCustomer,
  createCustomerRequest,
  updateCustomerRequest,
  deleteCustomerRequest,
  clearSearch,
  clearError,
  setPage,
  setPageSize
} from '../store/customers/customersSlice';
import { Customer, CreateCustomerRequest } from '../services/customersService';

export const useCustomers = () => {
  const dispatch = useDispatch();

  const {
    customers,
    selectedCustomer,
    searchResults,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    searchQuery,
    filters
  } = useSelector((state: RootState) => state.customers);

  // Fetch customers with current filters and pagination
  const fetchCustomers = (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
  }) => {
    dispatch(fetchCustomersRequest(params));
  };

  // Search customers
  const searchCustomers = (query: string) => {
    dispatch(searchCustomersRequest(query));
  };

  // Select a customer
  const selectACustomer = (customer: Customer | null) => {
    dispatch(selectCustomer(customer));
  };

  // Create a new customer
  const createCustomer = (customer: CreateCustomerRequest) => {
    dispatch(createCustomerRequest(customer));
  };

  // Update an existing customer
  const updateCustomer = (id: string, customer: CreateCustomerRequest) => {
    dispatch(updateCustomerRequest({ id, data: customer }));
  };

  // Delete a customer
  const deleteCustomer = (id: string) => {
    dispatch(deleteCustomerRequest(id));
  };

  // Clear search results
  const clearSearchResults = () => {
    dispatch(clearSearch());
  };

  // Clear error message
  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  // Change page
  const changePage = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchCustomersRequest({ page, pageSize }));
  };

  // Change page size
  const changePageSize = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(fetchCustomersRequest({ page: 1, pageSize: size }));
  };

  // Load customers on mount
  useEffect(() => {
    if (customers.length === 0 && !isLoading) {
      fetchCustomers();
    }
  }, []);

  return {
    // State
    customers,
    selectedCustomer,
    searchResults,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    searchQuery,
    filters,

    // Actions
    fetchCustomers,
    searchCustomers,
    selectCustomer: selectACustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearSearchResults,
    clearErrorMessage,
    changePage,
    changePageSize
  };
};
