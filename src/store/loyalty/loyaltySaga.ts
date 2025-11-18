/**
 * Redux Saga for Loyalty Program Side Effects
 */

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchLoyaltyProgramRequest,
  fetchLoyaltyProgramSuccess,
  fetchLoyaltyProgramFailure,
  createLoyaltyProgramRequest,
  createLoyaltyProgramSuccess,
  createLoyaltyProgramFailure,
  updateLoyaltyProgramRequest,
  updateLoyaltyProgramSuccess,
  updateLoyaltyProgramFailure,
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
  fetchCustomerLoyaltyRequest,
  fetchCustomerLoyaltySuccess,
  fetchCustomerLoyaltyFailure,
  fetchAllCustomerLoyaltiesRequest,
  fetchAllCustomerLoyaltiesSuccess,
  fetchAllCustomerLoyaltiesFailure,
  enrollCustomerRequest,
  enrollCustomerSuccess,
  enrollCustomerFailure,
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
  redeemRewardRequest,
  redeemRewardSuccess,
  redeemRewardFailure,
  fetchRedemptionsRequest,
  fetchRedemptionsSuccess,
  fetchRedemptionsFailure,
  updateRedemptionStatusRequest,
  updateRedemptionStatusSuccess,
  updateRedemptionStatusFailure,
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure
} from './loyaltySlice';
import * as loyaltyService from '../../services/loyaltyService';
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
} from '../../types/loyalty';

// Program Sagas
function* fetchLoyaltyProgramSaga() {
  try {
    const program: ReturnType<typeof loyaltyService.getLoyaltyProgram> = yield call(
      loyaltyService.getLoyaltyProgram
    );
    yield put(fetchLoyaltyProgramSuccess(program));
  } catch (error) {
    yield put(fetchLoyaltyProgramFailure((error as Error).message));
  }
}

function* createLoyaltyProgramSaga(action: PayloadAction<CreateLoyaltyProgramRequest>) {
  try {
    const program: ReturnType<typeof loyaltyService.createLoyaltyProgram> = yield call(
      loyaltyService.createLoyaltyProgram,
      action.payload
    );
    yield put(createLoyaltyProgramSuccess(program));
  } catch (error) {
    yield put(createLoyaltyProgramFailure((error as Error).message));
  }
}

function* updateLoyaltyProgramSaga(action: PayloadAction<UpdateLoyaltyProgramRequest>) {
  try {
    const program: ReturnType<typeof loyaltyService.updateLoyaltyProgram> = yield call(
      loyaltyService.updateLoyaltyProgram,
      action.payload
    );
    yield put(updateLoyaltyProgramSuccess(program));
  } catch (error) {
    yield put(updateLoyaltyProgramFailure((error as Error).message));
  }
}

// Tier Sagas
function* fetchTiersSaga(action: PayloadAction<string>) {
  try {
    const tiers: ReturnType<typeof loyaltyService.getAllTiers> = yield call(
      loyaltyService.getAllTiers,
      action.payload
    );
    yield put(fetchTiersSuccess(tiers));
  } catch (error) {
    yield put(fetchTiersFailure((error as Error).message));
  }
}

function* createTierSaga(action: PayloadAction<CreateTierRequest>) {
  try {
    const tier: ReturnType<typeof loyaltyService.createTier> = yield call(
      loyaltyService.createTier,
      action.payload
    );
    yield put(createTierSuccess(tier));
  } catch (error) {
    yield put(createTierFailure((error as Error).message));
  }
}

function* updateTierSaga(action: PayloadAction<UpdateTierRequest>) {
  try {
    const tier: ReturnType<typeof loyaltyService.updateTier> = yield call(
      loyaltyService.updateTier,
      action.payload
    );
    yield put(updateTierSuccess(tier));
  } catch (error) {
    yield put(updateTierFailure((error as Error).message));
  }
}

function* deleteTierSaga(action: PayloadAction<string>) {
  try {
    yield call(loyaltyService.deleteTier, action.payload);
    yield put(deleteTierSuccess(action.payload));
  } catch (error) {
    yield put(deleteTierFailure((error as Error).message));
  }
}

// Customer Loyalty Sagas
function* fetchCustomerLoyaltySaga(action: PayloadAction<string>) {
  try {
    const customerLoyalty: ReturnType<typeof loyaltyService.getCustomerLoyalty> = yield call(
      loyaltyService.getCustomerLoyalty,
      action.payload
    );
    yield put(fetchCustomerLoyaltySuccess(customerLoyalty));
  } catch (error) {
    yield put(fetchCustomerLoyaltyFailure((error as Error).message));
  }
}

function* fetchAllCustomerLoyaltiesSaga(action: PayloadAction<LoyaltyFilters | undefined>) {
  try {
    const customerLoyalties: ReturnType<typeof loyaltyService.getAllCustomerLoyalties> = yield call(
      loyaltyService.getAllCustomerLoyalties,
      action.payload
    );
    yield put(fetchAllCustomerLoyaltiesSuccess(customerLoyalties));
  } catch (error) {
    yield put(fetchAllCustomerLoyaltiesFailure((error as Error).message));
  }
}

function* enrollCustomerSaga(action: PayloadAction<EnrollCustomerRequest>) {
  try {
    const customerLoyalty: ReturnType<typeof loyaltyService.enrollCustomer> = yield call(
      loyaltyService.enrollCustomer,
      action.payload
    );
    yield put(enrollCustomerSuccess(customerLoyalty));
  } catch (error) {
    yield put(enrollCustomerFailure((error as Error).message));
  }
}

// Transaction Sagas
function* fetchTransactionsSaga(
  action: PayloadAction<{ customerLoyaltyId: string; filters?: TransactionFilters }>
) {
  try {
    const transactions: ReturnType<typeof loyaltyService.getTransactions> = yield call(
      loyaltyService.getTransactions,
      action.payload.customerLoyaltyId,
      action.payload.filters
    );
    yield put(fetchTransactionsSuccess(transactions));
  } catch (error) {
    yield put(fetchTransactionsFailure((error as Error).message));
  }
}

function* earnPointsSaga(action: PayloadAction<EarnPointsRequest>) {
  try {
    const transaction: ReturnType<typeof loyaltyService.earnPoints> = yield call(
      loyaltyService.earnPoints,
      action.payload
    );
    yield put(earnPointsSuccess(transaction));
    // Refresh customer loyalty to update points
    if (action.payload.customerLoyaltyId) {
      yield put(fetchCustomerLoyaltyRequest(action.payload.customerLoyaltyId));
    }
  } catch (error) {
    yield put(earnPointsFailure((error as Error).message));
  }
}

function* redeemPointsSaga(action: PayloadAction<RedeemPointsRequest>) {
  try {
    const transaction: ReturnType<typeof loyaltyService.redeemPoints> = yield call(
      loyaltyService.redeemPoints,
      action.payload
    );
    yield put(redeemPointsSuccess(transaction));
    // Refresh customer loyalty to update points
    if (action.payload.customerLoyaltyId) {
      yield put(fetchCustomerLoyaltyRequest(action.payload.customerLoyaltyId));
    }
  } catch (error) {
    yield put(redeemPointsFailure((error as Error).message));
  }
}

function* adjustPointsSaga(action: PayloadAction<AdjustPointsRequest>) {
  try {
    const transaction: ReturnType<typeof loyaltyService.adjustPoints> = yield call(
      loyaltyService.adjustPoints,
      action.payload
    );
    yield put(adjustPointsSuccess(transaction));
    // Refresh customer loyalty to update points
    if (action.payload.customerLoyaltyId) {
      yield put(fetchCustomerLoyaltyRequest(action.payload.customerLoyaltyId));
    }
  } catch (error) {
    yield put(adjustPointsFailure((error as Error).message));
  }
}

function* fetchExpiringPointsSaga(action: PayloadAction<{ customerId: string; days: number }>) {
  try {
    const expiringPoints: ReturnType<typeof loyaltyService.getExpiringPoints> = yield call(
      loyaltyService.getExpiringPoints,
      action.payload.customerId,
      action.payload.days
    );
    yield put(fetchExpiringPointsSuccess(expiringPoints));
  } catch (error) {
    yield put(fetchExpiringPointsFailure((error as Error).message));
  }
}

// Reward Sagas
function* fetchRewardsSaga(
  action: PayloadAction<{ programId: string; filters?: RewardFilters }>
) {
  try {
    const rewards: ReturnType<typeof loyaltyService.getAvailableRewards> = yield call(
      loyaltyService.getAvailableRewards,
      action.payload.programId,
      action.payload.filters
    );
    yield put(fetchRewardsSuccess(rewards));
  } catch (error) {
    yield put(fetchRewardsFailure((error as Error).message));
  }
}

function* createRewardSaga(action: PayloadAction<CreateRewardRequest>) {
  try {
    const reward: ReturnType<typeof loyaltyService.createReward> = yield call(
      loyaltyService.createReward,
      action.payload
    );
    yield put(createRewardSuccess(reward));
  } catch (error) {
    yield put(createRewardFailure((error as Error).message));
  }
}

function* updateRewardSaga(action: PayloadAction<UpdateRewardRequest>) {
  try {
    const reward: ReturnType<typeof loyaltyService.updateReward> = yield call(
      loyaltyService.updateReward,
      action.payload
    );
    yield put(updateRewardSuccess(reward));
  } catch (error) {
    yield put(updateRewardFailure((error as Error).message));
  }
}

function* deleteRewardSaga(action: PayloadAction<string>) {
  try {
    yield call(loyaltyService.deleteReward, action.payload);
    yield put(deleteRewardSuccess(action.payload));
  } catch (error) {
    yield put(deleteRewardFailure((error as Error).message));
  }
}

// Redemption Sagas
function* redeemRewardSaga(action: PayloadAction<RedeemRewardRequest>) {
  try {
    const redemption: ReturnType<typeof loyaltyService.redeemReward> = yield call(
      loyaltyService.redeemReward,
      action.payload
    );
    yield put(redeemRewardSuccess(redemption));
    // Refresh customer loyalty to update points
    if (action.payload.customerLoyaltyId) {
      yield put(fetchCustomerLoyaltyRequest(action.payload.customerLoyaltyId));
    }
  } catch (error) {
    yield put(redeemRewardFailure((error as Error).message));
  }
}

function* fetchRedemptionsSaga(action: PayloadAction<string>) {
  try {
    const redemptions: ReturnType<typeof loyaltyService.getCustomerRedemptions> = yield call(
      loyaltyService.getCustomerRedemptions,
      action.payload
    );
    yield put(fetchRedemptionsSuccess(redemptions));
  } catch (error) {
    yield put(fetchRedemptionsFailure((error as Error).message));
  }
}

function* updateRedemptionStatusSaga(
  action: PayloadAction<{ redemptionId: string; status: string }>
) {
  try {
    const redemption: ReturnType<typeof loyaltyService.updateRedemptionStatus> = yield call(
      loyaltyService.updateRedemptionStatus,
      action.payload.redemptionId,
      action.payload.status as never
    );
    yield put(updateRedemptionStatusSuccess(redemption));
  } catch (error) {
    yield put(updateRedemptionStatusFailure((error as Error).message));
  }
}

// Dashboard Saga
function* fetchDashboardSaga(
  action: PayloadAction<{ dateFrom?: string; dateTo?: string } | undefined>
) {
  try {
    const dashboard: ReturnType<typeof loyaltyService.getLoyaltyDashboard> = yield call(
      loyaltyService.getLoyaltyDashboard,
      action.payload?.dateFrom,
      action.payload?.dateTo
    );
    yield put(fetchDashboardSuccess(dashboard));
  } catch (error) {
    yield put(fetchDashboardFailure((error as Error).message));
  }
}

// Watchers
function* watchLoyaltyProgram() {
  yield takeLatest(fetchLoyaltyProgramRequest.type, fetchLoyaltyProgramSaga);
  yield takeLatest(createLoyaltyProgramRequest.type, createLoyaltyProgramSaga);
  yield takeLatest(updateLoyaltyProgramRequest.type, updateLoyaltyProgramSaga);
}

function* watchTiers() {
  yield takeLatest(fetchTiersRequest.type, fetchTiersSaga);
  yield takeLatest(createTierRequest.type, createTierSaga);
  yield takeLatest(updateTierRequest.type, updateTierSaga);
  yield takeLatest(deleteTierRequest.type, deleteTierSaga);
}

function* watchCustomerLoyalty() {
  yield takeLatest(fetchCustomerLoyaltyRequest.type, fetchCustomerLoyaltySaga);
  yield takeLatest(fetchAllCustomerLoyaltiesRequest.type, fetchAllCustomerLoyaltiesSaga);
  yield takeLatest(enrollCustomerRequest.type, enrollCustomerSaga);
}

function* watchTransactions() {
  yield takeLatest(fetchTransactionsRequest.type, fetchTransactionsSaga);
  yield takeLatest(earnPointsRequest.type, earnPointsSaga);
  yield takeLatest(redeemPointsRequest.type, redeemPointsSaga);
  yield takeLatest(adjustPointsRequest.type, adjustPointsSaga);
  yield takeLatest(fetchExpiringPointsRequest.type, fetchExpiringPointsSaga);
}

function* watchRewards() {
  yield takeLatest(fetchRewardsRequest.type, fetchRewardsSaga);
  yield takeLatest(createRewardRequest.type, createRewardSaga);
  yield takeLatest(updateRewardRequest.type, updateRewardSaga);
  yield takeLatest(deleteRewardRequest.type, deleteRewardSaga);
}

function* watchRedemptions() {
  yield takeLatest(redeemRewardRequest.type, redeemRewardSaga);
  yield takeLatest(fetchRedemptionsRequest.type, fetchRedemptionsSaga);
  yield takeLatest(updateRedemptionStatusRequest.type, updateRedemptionStatusSaga);
}

function* watchDashboard() {
  yield takeLatest(fetchDashboardRequest.type, fetchDashboardSaga);
}

export default function* loyaltySaga() {
  yield all([
    watchLoyaltyProgram(),
    watchTiers(),
    watchCustomerLoyalty(),
    watchTransactions(),
    watchRewards(),
    watchRedemptions(),
    watchDashboard()
  ]);
}
