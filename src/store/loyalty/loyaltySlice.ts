/**
 * Redux Slice for Loyalty Program State Management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LoyaltyProgram,
  CustomerTier,
  CustomerLoyalty,
  LoyaltyTransaction,
  Reward,
  RewardRedemption,
  LoyaltyDashboard,
  LoyaltyFilters,
  RewardFilters,
  TransactionFilters
} from '../../types/loyalty';

export interface LoyaltyState {
  program: LoyaltyProgram | null;
  tiers: CustomerTier[];
  customerLoyalties: CustomerLoyalty[];
  currentCustomerLoyalty: CustomerLoyalty | null;
  transactions: LoyaltyTransaction[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  dashboard: LoyaltyDashboard | null;
  expiringPoints: { points: number; expiryDate: string }[];
  loading: {
    program: boolean;
    tiers: boolean;
    customers: boolean;
    transactions: boolean;
    rewards: boolean;
    redemptions: boolean;
    dashboard: boolean;
  };
  error: {
    program: string | null;
    tiers: string | null;
    customers: string | null;
    transactions: string | null;
    rewards: string | null;
    redemptions: string | null;
    dashboard: string | null;
  };
  filters: {
    loyalty: LoyaltyFilters;
    rewards: RewardFilters;
    transactions: TransactionFilters;
  };
}

const initialState: LoyaltyState = {
  program: null,
  tiers: [],
  customerLoyalties: [],
  currentCustomerLoyalty: null,
  transactions: [],
  rewards: [],
  redemptions: [],
  dashboard: null,
  expiringPoints: [],
  loading: {
    program: false,
    tiers: false,
    customers: false,
    transactions: false,
    rewards: false,
    redemptions: false,
    dashboard: false
  },
  error: {
    program: null,
    tiers: null,
    customers: null,
    transactions: null,
    rewards: null,
    redemptions: null,
    dashboard: null
  },
  filters: {
    loyalty: {},
    rewards: {},
    transactions: {}
  }
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    // Program Actions
    fetchLoyaltyProgramRequest: (state) => {
      state.loading.program = true;
      state.error.program = null;
    },
    fetchLoyaltyProgramSuccess: (state, action: PayloadAction<LoyaltyProgram>) => {
      state.program = action.payload;
      state.loading.program = false;
      state.error.program = null;
    },
    fetchLoyaltyProgramFailure: (state, action: PayloadAction<string>) => {
      state.loading.program = false;
      state.error.program = action.payload;
    },

    createLoyaltyProgramRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.program = true;
      state.error.program = null;
    },
    createLoyaltyProgramSuccess: (state, action: PayloadAction<LoyaltyProgram>) => {
      state.program = action.payload;
      state.loading.program = false;
      state.error.program = null;
    },
    createLoyaltyProgramFailure: (state, action: PayloadAction<string>) => {
      state.loading.program = false;
      state.error.program = action.payload;
    },

    updateLoyaltyProgramRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.program = true;
      state.error.program = null;
    },
    updateLoyaltyProgramSuccess: (state, action: PayloadAction<LoyaltyProgram>) => {
      state.program = action.payload;
      state.loading.program = false;
      state.error.program = null;
    },
    updateLoyaltyProgramFailure: (state, action: PayloadAction<string>) => {
      state.loading.program = false;
      state.error.program = action.payload;
    },

    // Tier Actions
    fetchTiersRequest: (state, _action: PayloadAction<string>) => {
      state.loading.tiers = true;
      state.error.tiers = null;
    },
    fetchTiersSuccess: (state, action: PayloadAction<CustomerTier[]>) => {
      state.tiers = action.payload;
      state.loading.tiers = false;
      state.error.tiers = null;
    },
    fetchTiersFailure: (state, action: PayloadAction<string>) => {
      state.loading.tiers = false;
      state.error.tiers = action.payload;
    },

    createTierRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.tiers = true;
      state.error.tiers = null;
    },
    createTierSuccess: (state, action: PayloadAction<CustomerTier>) => {
      state.tiers.push(action.payload);
      state.loading.tiers = false;
      state.error.tiers = null;
    },
    createTierFailure: (state, action: PayloadAction<string>) => {
      state.loading.tiers = false;
      state.error.tiers = action.payload;
    },

    updateTierRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.tiers = true;
      state.error.tiers = null;
    },
    updateTierSuccess: (state, action: PayloadAction<CustomerTier>) => {
      const index = state.tiers.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tiers[index] = action.payload;
      }
      state.loading.tiers = false;
      state.error.tiers = null;
    },
    updateTierFailure: (state, action: PayloadAction<string>) => {
      state.loading.tiers = false;
      state.error.tiers = action.payload;
    },

    deleteTierRequest: (state, _action: PayloadAction<string>) => {
      state.loading.tiers = true;
      state.error.tiers = null;
    },
    deleteTierSuccess: (state, action: PayloadAction<string>) => {
      state.tiers = state.tiers.filter(t => t.id !== action.payload);
      state.loading.tiers = false;
      state.error.tiers = null;
    },
    deleteTierFailure: (state, action: PayloadAction<string>) => {
      state.loading.tiers = false;
      state.error.tiers = action.payload;
    },

    // Customer Loyalty Actions
    fetchCustomerLoyaltyRequest: (state, _action: PayloadAction<string>) => {
      state.loading.customers = true;
      state.error.customers = null;
    },
    fetchCustomerLoyaltySuccess: (state, action: PayloadAction<CustomerLoyalty>) => {
      state.currentCustomerLoyalty = action.payload;
      state.loading.customers = false;
      state.error.customers = null;
    },
    fetchCustomerLoyaltyFailure: (state, action: PayloadAction<string>) => {
      state.loading.customers = false;
      state.error.customers = action.payload;
    },

    fetchAllCustomerLoyaltiesRequest: (state, _action: PayloadAction<LoyaltyFilters | undefined>) => {
      state.loading.customers = true;
      state.error.customers = null;
    },
    fetchAllCustomerLoyaltiesSuccess: (state, action: PayloadAction<CustomerLoyalty[]>) => {
      state.customerLoyalties = action.payload;
      state.loading.customers = false;
      state.error.customers = null;
    },
    fetchAllCustomerLoyaltiesFailure: (state, action: PayloadAction<string>) => {
      state.loading.customers = false;
      state.error.customers = action.payload;
    },

    enrollCustomerRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.customers = true;
      state.error.customers = null;
    },
    enrollCustomerSuccess: (state, action: PayloadAction<CustomerLoyalty>) => {
      state.customerLoyalties.push(action.payload);
      state.currentCustomerLoyalty = action.payload;
      state.loading.customers = false;
      state.error.customers = null;
    },
    enrollCustomerFailure: (state, action: PayloadAction<string>) => {
      state.loading.customers = false;
      state.error.customers = action.payload;
    },

    // Transaction Actions
    fetchTransactionsRequest: (state, _action: PayloadAction<{ customerLoyaltyId: string; filters?: TransactionFilters }>) => {
      state.loading.transactions = true;
      state.error.transactions = null;
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<LoyaltyTransaction[]>) => {
      state.transactions = action.payload;
      state.loading.transactions = false;
      state.error.transactions = null;
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.loading.transactions = false;
      state.error.transactions = action.payload;
    },

    earnPointsRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.transactions = true;
      state.error.transactions = null;
    },
    earnPointsSuccess: (state, action: PayloadAction<LoyaltyTransaction>) => {
      state.transactions.unshift(action.payload);
      state.loading.transactions = false;
      state.error.transactions = null;
    },
    earnPointsFailure: (state, action: PayloadAction<string>) => {
      state.loading.transactions = false;
      state.error.transactions = action.payload;
    },

    redeemPointsRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.transactions = true;
      state.error.transactions = null;
    },
    redeemPointsSuccess: (state, action: PayloadAction<LoyaltyTransaction>) => {
      state.transactions.unshift(action.payload);
      state.loading.transactions = false;
      state.error.transactions = null;
    },
    redeemPointsFailure: (state, action: PayloadAction<string>) => {
      state.loading.transactions = false;
      state.error.transactions = action.payload;
    },

    adjustPointsRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.transactions = true;
      state.error.transactions = null;
    },
    adjustPointsSuccess: (state, action: PayloadAction<LoyaltyTransaction>) => {
      state.transactions.unshift(action.payload);
      state.loading.transactions = false;
      state.error.transactions = null;
    },
    adjustPointsFailure: (state, action: PayloadAction<string>) => {
      state.loading.transactions = false;
      state.error.transactions = action.payload;
    },

    fetchExpiringPointsRequest: (state, _action: PayloadAction<{ customerId: string; days: number }>) => {
      state.loading.customers = true;
    },
    fetchExpiringPointsSuccess: (state, action: PayloadAction<{ points: number; expiryDate: string }[]>) => {
      state.expiringPoints = action.payload;
      state.loading.customers = false;
    },
    fetchExpiringPointsFailure: (state, action: PayloadAction<string>) => {
      state.loading.customers = false;
      state.error.customers = action.payload;
    },

    // Reward Actions
    fetchRewardsRequest: (state, _action: PayloadAction<{ programId: string; filters?: RewardFilters }>) => {
      state.loading.rewards = true;
      state.error.rewards = null;
    },
    fetchRewardsSuccess: (state, action: PayloadAction<Reward[]>) => {
      state.rewards = action.payload;
      state.loading.rewards = false;
      state.error.rewards = null;
    },
    fetchRewardsFailure: (state, action: PayloadAction<string>) => {
      state.loading.rewards = false;
      state.error.rewards = action.payload;
    },

    createRewardRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.rewards = true;
      state.error.rewards = null;
    },
    createRewardSuccess: (state, action: PayloadAction<Reward>) => {
      state.rewards.push(action.payload);
      state.loading.rewards = false;
      state.error.rewards = null;
    },
    createRewardFailure: (state, action: PayloadAction<string>) => {
      state.loading.rewards = false;
      state.error.rewards = action.payload;
    },

    updateRewardRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.rewards = true;
      state.error.rewards = null;
    },
    updateRewardSuccess: (state, action: PayloadAction<Reward>) => {
      const index = state.rewards.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rewards[index] = action.payload;
      }
      state.loading.rewards = false;
      state.error.rewards = null;
    },
    updateRewardFailure: (state, action: PayloadAction<string>) => {
      state.loading.rewards = false;
      state.error.rewards = action.payload;
    },

    deleteRewardRequest: (state, _action: PayloadAction<string>) => {
      state.loading.rewards = true;
      state.error.rewards = null;
    },
    deleteRewardSuccess: (state, action: PayloadAction<string>) => {
      state.rewards = state.rewards.filter(r => r.id !== action.payload);
      state.loading.rewards = false;
      state.error.rewards = null;
    },
    deleteRewardFailure: (state, action: PayloadAction<string>) => {
      state.loading.rewards = false;
      state.error.rewards = action.payload;
    },

    // Redemption Actions
    redeemRewardRequest: (state, _action: PayloadAction<unknown>) => {
      state.loading.redemptions = true;
      state.error.redemptions = null;
    },
    redeemRewardSuccess: (state, action: PayloadAction<RewardRedemption>) => {
      state.redemptions.unshift(action.payload);
      state.loading.redemptions = false;
      state.error.redemptions = null;
    },
    redeemRewardFailure: (state, action: PayloadAction<string>) => {
      state.loading.redemptions = false;
      state.error.redemptions = action.payload;
    },

    fetchRedemptionsRequest: (state, _action: PayloadAction<string>) => {
      state.loading.redemptions = true;
      state.error.redemptions = null;
    },
    fetchRedemptionsSuccess: (state, action: PayloadAction<RewardRedemption[]>) => {
      state.redemptions = action.payload;
      state.loading.redemptions = false;
      state.error.redemptions = null;
    },
    fetchRedemptionsFailure: (state, action: PayloadAction<string>) => {
      state.loading.redemptions = false;
      state.error.redemptions = action.payload;
    },

    updateRedemptionStatusRequest: (state, _action: PayloadAction<{ redemptionId: string; status: string }>) => {
      state.loading.redemptions = true;
      state.error.redemptions = null;
    },
    updateRedemptionStatusSuccess: (state, action: PayloadAction<RewardRedemption>) => {
      const index = state.redemptions.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.redemptions[index] = action.payload;
      }
      state.loading.redemptions = false;
      state.error.redemptions = null;
    },
    updateRedemptionStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading.redemptions = false;
      state.error.redemptions = action.payload;
    },

    // Dashboard Actions
    fetchDashboardRequest: (state, _action: PayloadAction<{ dateFrom?: string; dateTo?: string } | undefined>) => {
      state.loading.dashboard = true;
      state.error.dashboard = null;
    },
    fetchDashboardSuccess: (state, action: PayloadAction<LoyaltyDashboard>) => {
      state.dashboard = action.payload;
      state.loading.dashboard = false;
      state.error.dashboard = null;
    },
    fetchDashboardFailure: (state, action: PayloadAction<string>) => {
      state.loading.dashboard = false;
      state.error.dashboard = action.payload;
    },

    // Filter Actions
    setLoyaltyFilters: (state, action: PayloadAction<LoyaltyFilters>) => {
      state.filters.loyalty = action.payload;
    },
    setRewardFilters: (state, action: PayloadAction<RewardFilters>) => {
      state.filters.rewards = action.payload;
    },
    setTransactionFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.filters.transactions = action.payload;
    },

    // Clear Actions
    clearCurrentCustomerLoyalty: (state) => {
      state.currentCustomerLoyalty = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
    clearRedemptions: (state) => {
      state.redemptions = [];
    },
    clearErrors: (state) => {
      state.error = {
        program: null,
        tiers: null,
        customers: null,
        transactions: null,
        rewards: null,
        redemptions: null,
        dashboard: null
      };
    }
  }
});

export const {
  // Program
  fetchLoyaltyProgramRequest,
  fetchLoyaltyProgramSuccess,
  fetchLoyaltyProgramFailure,
  createLoyaltyProgramRequest,
  createLoyaltyProgramSuccess,
  createLoyaltyProgramFailure,
  updateLoyaltyProgramRequest,
  updateLoyaltyProgramSuccess,
  updateLoyaltyProgramFailure,
  // Tiers
  fetchTiersRequest,
  fetchTiersSuccess,
  fetchTiersFailure,
  createTierRequest,
  createTierSuccess,
  createTierFailure,
  updateTierRequest,
  updateTierSuccess,
  updateTierFailure,
  deleteTierRequest,
  deleteTierSuccess,
  deleteTierFailure,
  // Customer Loyalty
  fetchCustomerLoyaltyRequest,
  fetchCustomerLoyaltySuccess,
  fetchCustomerLoyaltyFailure,
  fetchAllCustomerLoyaltiesRequest,
  fetchAllCustomerLoyaltiesSuccess,
  fetchAllCustomerLoyaltiesFailure,
  enrollCustomerRequest,
  enrollCustomerSuccess,
  enrollCustomerFailure,
  // Transactions
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  earnPointsRequest,
  earnPointsSuccess,
  earnPointsFailure,
  redeemPointsRequest,
  redeemPointsSuccess,
  redeemPointsFailure,
  adjustPointsRequest,
  adjustPointsSuccess,
  adjustPointsFailure,
  fetchExpiringPointsRequest,
  fetchExpiringPointsSuccess,
  fetchExpiringPointsFailure,
  // Rewards
  fetchRewardsRequest,
  fetchRewardsSuccess,
  fetchRewardsFailure,
  createRewardRequest,
  createRewardSuccess,
  createRewardFailure,
  updateRewardRequest,
  updateRewardSuccess,
  updateRewardFailure,
  deleteRewardRequest,
  deleteRewardSuccess,
  deleteRewardFailure,
  // Redemptions
  redeemRewardRequest,
  redeemRewardSuccess,
  redeemRewardFailure,
  fetchRedemptionsRequest,
  fetchRedemptionsSuccess,
  fetchRedemptionsFailure,
  updateRedemptionStatusRequest,
  updateRedemptionStatusSuccess,
  updateRedemptionStatusFailure,
  // Dashboard
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  // Filters
  setLoyaltyFilters,
  setRewardFilters,
  setTransactionFilters,
  // Clear
  clearCurrentCustomerLoyalty,
  clearTransactions,
  clearRedemptions,
  clearErrors
} = loyaltySlice.actions;

export default loyaltySlice.reducer;
