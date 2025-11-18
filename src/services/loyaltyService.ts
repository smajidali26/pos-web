/**
 * Loyalty Program API Service
 */

import axios from 'axios';
import {
  LoyaltyProgram,
  CustomerTier,
  CustomerLoyalty,
  LoyaltyTransaction,
  Reward,
  RewardRedemption,
  LoyaltyDashboard,
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Program Management
export const getLoyaltyProgram = async (): Promise<LoyaltyProgram> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/program`);
  return response.data;
};

export const createLoyaltyProgram = async (
  data: CreateLoyaltyProgramRequest
): Promise<LoyaltyProgram> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/program`, data);
  return response.data;
};

export const updateLoyaltyProgram = async (
  data: UpdateLoyaltyProgramRequest
): Promise<LoyaltyProgram> => {
  const response = await axios.put(`${API_BASE_URL}/loyalty/program/${data.id}`, data);
  return response.data;
};

// Tier Management
export const getAllTiers = async (programId: string): Promise<CustomerTier[]> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/tiers`, {
    params: { programId }
  });
  return response.data;
};

export const getTierById = async (tierId: string): Promise<CustomerTier> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/tiers/${tierId}`);
  return response.data;
};

export const createTier = async (data: CreateTierRequest): Promise<CustomerTier> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/tiers`, data);
  return response.data;
};

export const updateTier = async (data: UpdateTierRequest): Promise<CustomerTier> => {
  const response = await axios.put(`${API_BASE_URL}/loyalty/tiers/${data.id}`, data);
  return response.data;
};

export const deleteTier = async (tierId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/loyalty/tiers/${tierId}`);
};

// Customer Loyalty Management
export const getCustomerLoyalty = async (customerId: string): Promise<CustomerLoyalty> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/customers/${customerId}`);
  return response.data;
};

export const getAllCustomerLoyalties = async (
  filters?: LoyaltyFilters
): Promise<CustomerLoyalty[]> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/customers`, {
    params: filters
  });
  return response.data;
};

export const enrollCustomer = async (
  data: EnrollCustomerRequest
): Promise<CustomerLoyalty> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/customers/enroll`, data);
  return response.data;
};

export const updateCustomerLoyaltyStatus = async (
  customerLoyaltyId: string,
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
): Promise<CustomerLoyalty> => {
  const response = await axios.patch(
    `${API_BASE_URL}/loyalty/customers/${customerLoyaltyId}/status`,
    { status }
  );
  return response.data;
};

// Points Management
export const earnPoints = async (data: EarnPointsRequest): Promise<LoyaltyTransaction> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/points/earn`, data);
  return response.data;
};

export const redeemPoints = async (data: RedeemPointsRequest): Promise<LoyaltyTransaction> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/points/redeem`, data);
  return response.data;
};

export const adjustPoints = async (data: AdjustPointsRequest): Promise<LoyaltyTransaction> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/points/adjust`, data);
  return response.data;
};

// Transaction Management
export const getTransactions = async (
  customerLoyaltyId: string,
  filters?: TransactionFilters
): Promise<LoyaltyTransaction[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/loyalty/customers/${customerLoyaltyId}/transactions`,
    { params: filters }
  );
  return response.data;
};

export const getAllTransactions = async (
  filters?: TransactionFilters
): Promise<LoyaltyTransaction[]> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/transactions`, {
    params: filters
  });
  return response.data;
};

export const getExpiringPoints = async (
  customerId: string,
  days: number = 30
): Promise<{ points: number; expiryDate: string }[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/loyalty/customers/${customerId}/expiring-points`,
    { params: { days } }
  );
  return response.data;
};

// Reward Management
export const getAvailableRewards = async (
  programId: string,
  filters?: RewardFilters
): Promise<Reward[]> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/rewards`, {
    params: { programId, ...filters }
  });
  return response.data;
};

export const getRewardById = async (rewardId: string): Promise<Reward> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/rewards/${rewardId}`);
  return response.data;
};

export const createReward = async (data: CreateRewardRequest): Promise<Reward> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/rewards`, data);
  return response.data;
};

export const updateReward = async (data: UpdateRewardRequest): Promise<Reward> => {
  const response = await axios.put(`${API_BASE_URL}/loyalty/rewards/${data.id}`, data);
  return response.data;
};

export const deleteReward = async (rewardId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/loyalty/rewards/${rewardId}`);
};

// Reward Redemption Management
export const redeemReward = async (
  data: RedeemRewardRequest
): Promise<RewardRedemption> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/rewards/redeem`, data);
  return response.data;
};

export const getCustomerRedemptions = async (
  customerId: string
): Promise<RewardRedemption[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/loyalty/customers/${customerId}/redemptions`
  );
  return response.data;
};

export const getAllRedemptions = async (
  filters?: { status?: string; dateFrom?: string; dateTo?: string }
): Promise<RewardRedemption[]> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/redemptions`, {
    params: filters
  });
  return response.data;
};

export const updateRedemptionStatus = async (
  redemptionId: string,
  status: 'PENDING' | 'REDEEMED' | 'USED' | 'EXPIRED' | 'CANCELLED'
): Promise<RewardRedemption> => {
  const response = await axios.patch(
    `${API_BASE_URL}/loyalty/redemptions/${redemptionId}/status`,
    { status }
  );
  return response.data;
};

export const markRedemptionAsUsed = async (
  redemptionId: string,
  orderId?: string
): Promise<RewardRedemption> => {
  const response = await axios.post(
    `${API_BASE_URL}/loyalty/redemptions/${redemptionId}/use`,
    { orderId }
  );
  return response.data;
};

// Analytics and Dashboard
export const getLoyaltyDashboard = async (
  dateFrom?: string,
  dateTo?: string
): Promise<LoyaltyDashboard> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/dashboard`, {
    params: { dateFrom, dateTo }
  });
  return response.data;
};

export const calculatePointsForAmount = async (
  amount: number,
  tierId?: string
): Promise<{ points: number; multiplier: number }> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/calculate-points`, {
    amount,
    tierId
  });
  return response.data;
};

export const validatePointsRedemption = async (
  customerLoyaltyId: string,
  points: number
): Promise<{ valid: boolean; message?: string; availablePoints: number }> => {
  const response = await axios.post(`${API_BASE_URL}/loyalty/validate-redemption`, {
    customerLoyaltyId,
    points
  });
  return response.data;
};

export const getPointsValue = async (points: number): Promise<{ value: number }> => {
  const response = await axios.get(`${API_BASE_URL}/loyalty/points-value`, {
    params: { points }
  });
  return response.data;
};
