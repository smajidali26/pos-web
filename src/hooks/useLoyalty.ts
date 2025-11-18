/**
 * Custom Hook for Loyalty Program Management
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchLoyaltyProgramRequest,
  createLoyaltyProgramRequest,
  updateLoyaltyProgramRequest,
  fetchTiersRequest,
  createTierRequest,
  updateTierRequest,
  deleteTierRequest,
  fetchCustomerLoyaltyRequest,
  fetchAllCustomerLoyaltiesRequest,
  enrollCustomerRequest,
  fetchTransactionsRequest,
  earnPointsRequest,
  redeemPointsRequest,
  adjustPointsRequest,
  fetchExpiringPointsRequest,
  fetchRewardsRequest,
  createRewardRequest,
  updateRewardRequest,
  deleteRewardRequest,
  redeemRewardRequest,
  fetchRedemptionsRequest,
  updateRedemptionStatusRequest,
  fetchDashboardRequest,
  setLoyaltyFilters,
  setRewardFilters,
  setTransactionFilters,
  clearCurrentCustomerLoyalty,
  clearTransactions,
  clearRedemptions,
  clearErrors
} from '../store/loyalty/loyaltySlice';
import {
  CreateLoyaltyProgramRequest,
  UpdateLoyaltyProgramRequest,
  CreateTierRequest,
  UpdateTierRequest,
  EnrollCustomerRequest,
  EarnPointsRequest,
  RedeemPointsRequest,
  AdjustPointsRequest,
  CreateRewardRequest,
  UpdateRewardRequest,
  RedeemRewardRequest,
  LoyaltyFilters,
  RewardFilters,
  TransactionFilters
} from '../types/loyalty';

export const useLoyalty = () => {
  const dispatch = useDispatch();

  // Select state from Redux store
  const {
    program,
    tiers,
    customerLoyalties,
    currentCustomerLoyalty,
    transactions,
    rewards,
    redemptions,
    dashboard,
    expiringPoints,
    loading,
    error,
    filters
  } = useSelector((state: RootState) => state.loyalty);

  // Program Operations
  const fetchProgram = useCallback(() => {
    dispatch(fetchLoyaltyProgramRequest());
  }, [dispatch]);

  const createProgram = useCallback((data: CreateLoyaltyProgramRequest) => {
    dispatch(createLoyaltyProgramRequest(data));
  }, [dispatch]);

  const updateProgram = useCallback((data: UpdateLoyaltyProgramRequest) => {
    dispatch(updateLoyaltyProgramRequest(data));
  }, [dispatch]);

  // Tier Operations
  const fetchTiers = useCallback((programId: string) => {
    dispatch(fetchTiersRequest(programId));
  }, [dispatch]);

  const createTier = useCallback((data: CreateTierRequest) => {
    dispatch(createTierRequest(data));
  }, [dispatch]);

  const updateTier = useCallback((data: UpdateTierRequest) => {
    dispatch(updateTierRequest(data));
  }, [dispatch]);

  const deleteTier = useCallback((tierId: string) => {
    dispatch(deleteTierRequest(tierId));
  }, [dispatch]);

  // Customer Loyalty Operations
  const fetchCustomerLoyalty = useCallback((customerId: string) => {
    dispatch(fetchCustomerLoyaltyRequest(customerId));
  }, [dispatch]);

  const fetchAllCustomerLoyalties = useCallback((filters?: LoyaltyFilters) => {
    dispatch(fetchAllCustomerLoyaltiesRequest(filters));
  }, [dispatch]);

  const enrollCustomer = useCallback((data: EnrollCustomerRequest) => {
    dispatch(enrollCustomerRequest(data));
  }, [dispatch]);

  // Transaction Operations
  const fetchTransactions = useCallback(
    (customerLoyaltyId: string, filters?: TransactionFilters) => {
      dispatch(fetchTransactionsRequest({ customerLoyaltyId, filters }));
    },
    [dispatch]
  );

  const earnPoints = useCallback((data: EarnPointsRequest) => {
    dispatch(earnPointsRequest(data));
  }, [dispatch]);

  const redeemPoints = useCallback((data: RedeemPointsRequest) => {
    dispatch(redeemPointsRequest(data));
  }, [dispatch]);

  const adjustPoints = useCallback((data: AdjustPointsRequest) => {
    dispatch(adjustPointsRequest(data));
  }, [dispatch]);

  const fetchExpiringPoints = useCallback((customerId: string, days: number = 30) => {
    dispatch(fetchExpiringPointsRequest({ customerId, days }));
  }, [dispatch]);

  // Reward Operations
  const fetchRewards = useCallback((programId: string, filters?: RewardFilters) => {
    dispatch(fetchRewardsRequest({ programId, filters }));
  }, [dispatch]);

  const createReward = useCallback((data: CreateRewardRequest) => {
    dispatch(createRewardRequest(data));
  }, [dispatch]);

  const updateReward = useCallback((data: UpdateRewardRequest) => {
    dispatch(updateRewardRequest(data));
  }, [dispatch]);

  const deleteReward = useCallback((rewardId: string) => {
    dispatch(deleteRewardRequest(rewardId));
  }, [dispatch]);

  // Redemption Operations
  const redeemReward = useCallback((data: RedeemRewardRequest) => {
    dispatch(redeemRewardRequest(data));
  }, [dispatch]);

  const fetchRedemptions = useCallback((customerId: string) => {
    dispatch(fetchRedemptionsRequest(customerId));
  }, [dispatch]);

  const updateRedemptionStatus = useCallback(
    (redemptionId: string, status: 'PENDING' | 'REDEEMED' | 'USED' | 'EXPIRED' | 'CANCELLED') => {
      dispatch(updateRedemptionStatusRequest({ redemptionId, status }));
    },
    [dispatch]
  );

  // Dashboard Operations
  const fetchDashboard = useCallback((dateFrom?: string, dateTo?: string) => {
    dispatch(fetchDashboardRequest({ dateFrom, dateTo }));
  }, [dispatch]);

  // Filter Operations
  const updateLoyaltyFilters = useCallback((filters: LoyaltyFilters) => {
    dispatch(setLoyaltyFilters(filters));
  }, [dispatch]);

  const updateRewardFilters = useCallback((filters: RewardFilters) => {
    dispatch(setRewardFilters(filters));
  }, [dispatch]);

  const updateTransactionFilters = useCallback((filters: TransactionFilters) => {
    dispatch(setTransactionFilters(filters));
  }, [dispatch]);

  // Clear Operations
  const clearCustomerLoyalty = useCallback(() => {
    dispatch(clearCurrentCustomerLoyalty());
  }, [dispatch]);

  const clearTransactionList = useCallback(() => {
    dispatch(clearTransactions());
  }, [dispatch]);

  const clearRedemptionList = useCallback(() => {
    dispatch(clearRedemptions());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return {
    // State
    program,
    tiers,
    customerLoyalties,
    currentCustomerLoyalty,
    transactions,
    rewards,
    redemptions,
    dashboard,
    expiringPoints,
    loading,
    error,
    filters,

    // Program functions
    fetchProgram,
    createProgram,
    updateProgram,

    // Tier functions
    fetchTiers,
    createTier,
    updateTier,
    deleteTier,

    // Customer Loyalty functions
    fetchCustomerLoyalty,
    fetchAllCustomerLoyalties,
    enrollCustomer,

    // Transaction functions
    fetchTransactions,
    earnPoints,
    redeemPoints,
    adjustPoints,
    fetchExpiringPoints,

    // Reward functions
    fetchRewards,
    createReward,
    updateReward,
    deleteReward,

    // Redemption functions
    redeemReward,
    fetchRedemptions,
    updateRedemptionStatus,

    // Dashboard functions
    fetchDashboard,

    // Filter functions
    updateLoyaltyFilters,
    updateRewardFilters,
    updateTransactionFilters,

    // Clear functions
    clearCustomerLoyalty,
    clearTransactionList,
    clearRedemptionList,
    clearAllErrors
  };
};
