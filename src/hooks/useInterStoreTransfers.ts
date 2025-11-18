import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchTransfersRequest,
  fetchTransferByIdRequest,
  fetchPendingTransfersRequest,
  createTransferRequest,
  updateTransferRequest,
  submitTransferRequest,
  approveTransferRequest,
  rejectTransferRequest,
  shipTransferRequest,
  completeTransferRequest,
  cancelTransferRequest,
  selectTransfer,
  setFilters,
  setPage,
  clearError,
  clearSelectedTransfer
} from '../store/interStoreTransfers/transfersSlice';
import {
  InterStoreTransfer,
  CreateTransferRequest,
  UpdateTransferRequest,
  RejectTransferRequest,
  CancelTransferRequest,
  TransfersQueryParams
} from '../types/interStoreTransfer';

export const useInterStoreTransfers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    transfers,
    selectedTransfer,
    pendingTransfers,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    isLoading,
    error,
    filters
  } = useSelector((state: RootState) => state.interStoreTransfers);

  // Fetch all transfers
  const fetchTransfers = useCallback((params?: TransfersQueryParams) => {
    dispatch(fetchTransfersRequest(params));
  }, [dispatch]);

  // Fetch transfer by ID
  const fetchTransferById = useCallback((id: string) => {
    dispatch(fetchTransferByIdRequest(id));
  }, [dispatch]);

  // Fetch pending transfers
  const fetchPendingTransfers = useCallback(() => {
    dispatch(fetchPendingTransfersRequest());
  }, [dispatch]);

  // Create transfer
  const createTransfer = useCallback((transferData: CreateTransferRequest) => {
    dispatch(createTransferRequest(transferData));
  }, [dispatch]);

  // Update transfer
  const updateTransfer = useCallback((id: string, transferData: UpdateTransferRequest) => {
    dispatch(updateTransferRequest({ id, data: transferData }));
  }, [dispatch]);

  // Submit transfer
  const submitTransfer = useCallback((id: string) => {
    dispatch(submitTransferRequest(id));
  }, [dispatch]);

  // Approve transfer
  const approveTransfer = useCallback((id: string) => {
    dispatch(approveTransferRequest(id));
  }, [dispatch]);

  // Reject transfer
  const rejectTransfer = useCallback((id: string, reason: string) => {
    dispatch(rejectTransferRequest({ id, data: { reason } }));
  }, [dispatch]);

  // Ship transfer
  const shipTransfer = useCallback((id: string) => {
    dispatch(shipTransferRequest(id));
  }, [dispatch]);

  // Complete transfer
  const completeTransfer = useCallback((id: string) => {
    dispatch(completeTransferRequest(id));
  }, [dispatch]);

  // Cancel transfer
  const cancelTransfer = useCallback((id: string, reason: string) => {
    dispatch(cancelTransferRequest({ id, data: { reason } }));
  }, [dispatch]);

  // Select transfer
  const setSelectedTransfer = useCallback((transfer: InterStoreTransfer | null) => {
    dispatch(selectTransfer(transfer));
  }, [dispatch]);

  // Update filters
  const updateFilters = useCallback((newFilters: TransfersQueryParams) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Change page
  const changePage = useCallback((page: number) => {
    dispatch(setPage(page));
    dispatch(fetchTransfersRequest({ ...filters, page, pageSize }));
  }, [dispatch, filters, pageSize]);

  // Clear error
  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear selected transfer
  const clearSelected = useCallback(() => {
    dispatch(clearSelectedTransfer());
  }, [dispatch]);

  return {
    transfers,
    selectedTransfer,
    pendingTransfers,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    isLoading,
    error,
    filters,
    fetchTransfers,
    fetchTransferById,
    fetchPendingTransfers,
    createTransfer,
    updateTransfer,
    submitTransfer,
    approveTransfer,
    rejectTransfer,
    shipTransfer,
    completeTransfer,
    cancelTransfer,
    setSelectedTransfer,
    updateFilters,
    changePage,
    clearErrorMessage,
    clearSelected
  };
};

export default useInterStoreTransfers;
