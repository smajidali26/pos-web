import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchStoresRequest,
  fetchStoreByIdRequest,
  fetchStoreHierarchyRequest,
  fetchStoreInventoryRequest,
  fetchStoreSummaryRequest,
  createStoreRequest,
  updateStoreRequest,
  activateStoreRequest,
  deactivateStoreRequest,
  selectStore,
  setFilters,
  setPage,
  clearError,
  clearSelectedStore
} from '../store/stores/storesSlice';
import {
  Store,
  CreateStoreRequest,
  UpdateStoreRequest,
  StoresQueryParams
} from '../types/store';

export const useStores = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    stores,
    selectedStore,
    storeHierarchy,
    storeInventory,
    storeSummary,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    isLoading,
    error,
    filters
  } = useSelector((state: RootState) => state.stores);

  // Fetch all stores
  const fetchStores = useCallback((params?: StoresQueryParams) => {
    dispatch(fetchStoresRequest(params));
  }, [dispatch]);

  // Fetch store by ID
  const fetchStoreById = useCallback((id: string) => {
    dispatch(fetchStoreByIdRequest(id));
  }, [dispatch]);

  // Fetch store hierarchy
  const fetchStoreHierarchy = useCallback(() => {
    dispatch(fetchStoreHierarchyRequest());
  }, [dispatch]);

  // Fetch store inventory
  const fetchStoreInventory = useCallback((storeId: string) => {
    dispatch(fetchStoreInventoryRequest(storeId));
  }, [dispatch]);

  // Fetch store summary
  const fetchStoreSummary = useCallback((storeId: string) => {
    dispatch(fetchStoreSummaryRequest(storeId));
  }, [dispatch]);

  // Create store
  const createStore = useCallback((storeData: CreateStoreRequest) => {
    dispatch(createStoreRequest(storeData));
  }, [dispatch]);

  // Update store
  const updateStore = useCallback((id: string, storeData: UpdateStoreRequest) => {
    dispatch(updateStoreRequest({ id, data: storeData }));
  }, [dispatch]);

  // Activate store
  const activateStore = useCallback((id: string) => {
    dispatch(activateStoreRequest(id));
  }, [dispatch]);

  // Deactivate store
  const deactivateStore = useCallback((id: string) => {
    dispatch(deactivateStoreRequest(id));
  }, [dispatch]);

  // Select store
  const setSelectedStore = useCallback((store: Store | null) => {
    dispatch(selectStore(store));
  }, [dispatch]);

  // Update filters
  const updateFilters = useCallback((newFilters: StoresQueryParams) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Change page
  const changePage = useCallback((page: number) => {
    dispatch(setPage(page));
    dispatch(fetchStoresRequest({ ...filters, page, pageSize }));
  }, [dispatch, filters, pageSize]);

  // Clear error
  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear selected store
  const clearSelected = useCallback(() => {
    dispatch(clearSelectedStore());
  }, [dispatch]);

  return {
    stores,
    selectedStore,
    storeHierarchy,
    storeInventory,
    storeSummary,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    isLoading,
    error,
    filters,
    fetchStores,
    fetchStoreById,
    fetchStoreHierarchy,
    fetchStoreInventory,
    fetchStoreSummary,
    createStore,
    updateStore,
    activateStore,
    deactivateStore,
    setSelectedStore,
    updateFilters,
    changePage,
    clearErrorMessage,
    clearSelected
  };
};

export default useStores;
