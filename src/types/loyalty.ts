/**
 * Loyalty Program Type Definitions
 */

export enum TransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  ADJUSTMENT = 'ADJUSTMENT',
  EXPIRY = 'EXPIRY',
  BONUS = 'BONUS'
}

export enum RewardType {
  DISCOUNT_PERCENTAGE = 'DISCOUNT_PERCENTAGE',
  DISCOUNT_FIXED = 'DISCOUNT_FIXED',
  FREE_PRODUCT = 'FREE_PRODUCT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  CUSTOM = 'CUSTOM'
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerDollar: number;
  minimumPurchaseAmount: number;
  pointsExpiryDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerTier {
  id: string;
  programId: string;
  name: string;
  description: string;
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  color: string;
  benefits: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyalty {
  id: string;
  customerId: string;
  programId: string;
  tierId: string;
  currentPoints: number;
  lifetimePoints: number;
  pointsToNextTier: number;
  enrollmentDate: string;
  lastActivityDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  tier?: CustomerTier;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface LoyaltyTransaction {
  id: string;
  customerLoyaltyId: string;
  customerId: string;
  type: TransactionType;
  points: number;
  description: string;
  orderId?: string;
  rewardRedemptionId?: string;
  expiryDate?: string;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

export interface Reward {
  id: string;
  programId: string;
  name: string;
  description: string;
  type: RewardType;
  pointsCost: number;
  value: number;
  productId?: string;
  productName?: string;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  redemptionLimit?: number;
  redemptionCount: number;
  imageUrl?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  customerLoyaltyId: string;
  customerId: string;
  pointsUsed: number;
  status: 'PENDING' | 'REDEEMED' | 'USED' | 'EXPIRED' | 'CANCELLED';
  redemptionCode: string;
  redeemedAt: string;
  usedAt?: string;
  expiryDate?: string;
  orderId?: string;
  reward?: Reward;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoyaltyDashboard {
  activeMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  redemptionRate: number;
  tierDistribution: {
    tierId: string;
    tierName: string;
    tierColor: string;
    memberCount: number;
    percentage: number;
  }[];
  topCustomers: {
    customerId: string;
    customerName: string;
    tierName: string;
    currentPoints: number;
    lifetimePoints: number;
    totalSpent: number;
  }[];
  monthlyActivity: {
    month: string;
    pointsEarned: number;
    pointsRedeemed: number;
    newMembers: number;
  }[];
  recentTransactions: LoyaltyTransaction[];
  rewardStats: {
    totalRewards: number;
    activeRewards: number;
    totalRedemptions: number;
    mostPopularReward?: {
      id: string;
      name: string;
      redemptionCount: number;
    };
  };
}

export interface CreateLoyaltyProgramRequest {
  name: string;
  description: string;
  pointsPerDollar: number;
  minimumPurchaseAmount: number;
  pointsExpiryDays: number;
  isActive: boolean;
}

export interface UpdateLoyaltyProgramRequest extends Partial<CreateLoyaltyProgramRequest> {
  id: string;
}

export interface CreateTierRequest {
  programId: string;
  name: string;
  description: string;
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  color: string;
  benefits: string[];
  order: number;
}

export interface UpdateTierRequest extends Partial<Omit<CreateTierRequest, 'programId'>> {
  id: string;
}

export interface EnrollCustomerRequest {
  customerId: string;
  programId: string;
  tierId?: string;
}

export interface EarnPointsRequest {
  customerLoyaltyId: string;
  points: number;
  description: string;
  orderId?: string;
  metadata?: Record<string, unknown>;
}

export interface RedeemPointsRequest {
  customerLoyaltyId: string;
  points: number;
  description: string;
  orderId?: string;
  metadata?: Record<string, unknown>;
}

export interface AdjustPointsRequest {
  customerLoyaltyId: string;
  points: number;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface CreateRewardRequest {
  programId: string;
  name: string;
  description: string;
  type: RewardType;
  pointsCost: number;
  value: number;
  productId?: string;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  redemptionLimit?: number;
  imageUrl?: string;
  termsAndConditions?: string;
}

export interface UpdateRewardRequest extends Partial<Omit<CreateRewardRequest, 'programId'>> {
  id: string;
}

export interface RedeemRewardRequest {
  rewardId: string;
  customerLoyaltyId: string;
}

export interface LoyaltyFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  tierId?: string;
  minPoints?: number;
  maxPoints?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface RewardFilters {
  type?: RewardType;
  minPointsCost?: number;
  maxPointsCost?: number;
  isActive?: boolean;
}

export interface TransactionFilters {
  type?: TransactionType;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}
