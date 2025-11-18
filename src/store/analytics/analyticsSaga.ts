import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';
import {
  fetchDashboardRequest,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  fetchSalesAnalyticsRequest,
  fetchSalesAnalyticsSuccess,
  fetchSalesAnalyticsFailure,
  fetchSalesForecastRequest,
  fetchSalesForecastSuccess,
  fetchSalesForecastFailure,
  generateForecastsRequest,
  generateForecastsSuccess,
  generateForecastsFailure,
  fetchInventoryTurnoverRequest,
  fetchInventoryTurnoverSuccess,
  fetchInventoryTurnoverFailure,
  fetchABCAnalysisRequest,
  fetchABCAnalysisSuccess,
  fetchABCAnalysisFailure,
  calculateABCAnalysisRequest,
  calculateABCAnalysisSuccess,
  calculateABCAnalysisFailure,
  fetchInventoryAnalyticsRequest,
  fetchInventoryAnalyticsSuccess,
  fetchInventoryAnalyticsFailure,
  fetchSlowMovingStockRequest,
  fetchSlowMovingStockSuccess,
  fetchSlowMovingStockFailure,
  fetchReorderRecommendationsRequest,
  fetchReorderRecommendationsSuccess,
  fetchReorderRecommendationsFailure,
} from './analyticsSlice';
import type {
  RealTimeDashboard,
  SalesAnalytics,
  SalesForecast,
  InventoryTurnover,
  ABCAnalysis,
  InventoryAnalytics,
  SlowMovingItem,
  ReorderRecommendation,
  GetSalesAnalyticsRequest,
  GetSalesForecastRequest,
  GetInventoryTurnoverRequest,
  GetABCAnalysisRequest,
  GenerateForecastRequest,
  CalculateABCAnalysisRequest
} from '../../types/analytics';

// Worker Sagas

/**
 * Fetch real-time dashboard data
 */
function* fetchDashboardSaga() {
  try {
    const data: RealTimeDashboard = yield call(
      analyticsService.getRealTimeDashboard
    );
    yield put(fetchDashboardSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
    yield put(fetchDashboardFailure(message));
  }
}

/**
 * Fetch sales analytics
 */
function* fetchSalesAnalyticsSaga(action: PayloadAction<GetSalesAnalyticsRequest>) {
  try {
    const data: SalesAnalytics = yield call(
      analyticsService.getSalesAnalytics,
      action.payload
    );
    yield put(fetchSalesAnalyticsSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sales analytics';
    yield put(fetchSalesAnalyticsFailure(message));
  }
}

/**
 * Fetch sales forecast
 */
function* fetchSalesForecastSaga(action: PayloadAction<GetSalesForecastRequest>) {
  try {
    const data: SalesForecast = yield call(
      analyticsService.getSalesForecast,
      action.payload
    );
    yield put(fetchSalesForecastSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sales forecast';
    yield put(fetchSalesForecastFailure(message));
  }
}

/**
 * Generate sales forecasts (batch)
 */
function* generateForecastsSaga(action: PayloadAction<GenerateForecastRequest>) {
  try {
    const data: SalesForecast[] = yield call(
      analyticsService.generateSalesForecast,
      action.payload
    );
    yield put(generateForecastsSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate forecasts';
    yield put(generateForecastsFailure(message));
  }
}

/**
 * Fetch inventory turnover
 */
function* fetchInventoryTurnoverSaga(action: PayloadAction<GetInventoryTurnoverRequest>) {
  try {
    const data: InventoryTurnover = yield call(
      analyticsService.getInventoryTurnover,
      action.payload
    );
    yield put(fetchInventoryTurnoverSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch inventory turnover';
    yield put(fetchInventoryTurnoverFailure(message));
  }
}

/**
 * Fetch ABC analysis
 */
function* fetchABCAnalysisSaga(action: PayloadAction<GetABCAnalysisRequest>) {
  try {
    const data: ABCAnalysis = yield call(
      analyticsService.getABCAnalysis,
      action.payload
    );
    yield put(fetchABCAnalysisSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ABC analysis';
    yield put(fetchABCAnalysisFailure(message));
  }
}

/**
 * Calculate ABC analysis
 */
function* calculateABCAnalysisSaga(action: PayloadAction<CalculateABCAnalysisRequest>) {
  try {
    const data: ABCAnalysis = yield call(
      analyticsService.calculateABCAnalysis,
      action.payload
    );
    yield put(calculateABCAnalysisSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to calculate ABC analysis';
    yield put(calculateABCAnalysisFailure(message));
  }
}

/**
 * Fetch inventory analytics
 */
function* fetchInventoryAnalyticsSaga(action: PayloadAction<string | undefined>) {
  try {
    const data: InventoryAnalytics = yield call(
      analyticsService.getInventoryAnalytics,
      action.payload
    );
    yield put(fetchInventoryAnalyticsSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch inventory analytics';
    yield put(fetchInventoryAnalyticsFailure(message));
  }
}

/**
 * Fetch slow-moving stock
 */
function* fetchSlowMovingStockSaga(action: PayloadAction<string | undefined>) {
  try {
    const data: SlowMovingItem[] = yield call(
      analyticsService.getSlowMovingStock,
      action.payload
    );
    yield put(fetchSlowMovingStockSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch slow-moving stock';
    yield put(fetchSlowMovingStockFailure(message));
  }
}

/**
 * Fetch reorder recommendations
 */
function* fetchReorderRecommendationsSaga(action: PayloadAction<string | undefined>) {
  try {
    const data: ReorderRecommendation[] = yield call(
      analyticsService.getReorderRecommendations,
      action.payload
    );
    yield put(fetchReorderRecommendationsSuccess(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reorder recommendations';
    yield put(fetchReorderRecommendationsFailure(message));
  }
}

// Watcher Sagas
function* watchFetchDashboard() {
  yield takeLatest(fetchDashboardRequest.type, fetchDashboardSaga);
}

function* watchFetchSalesAnalytics() {
  yield takeLatest(fetchSalesAnalyticsRequest.type, fetchSalesAnalyticsSaga);
}

function* watchFetchSalesForecast() {
  yield takeLatest(fetchSalesForecastRequest.type, fetchSalesForecastSaga);
}

function* watchGenerateForecasts() {
  yield takeLatest(generateForecastsRequest.type, generateForecastsSaga);
}

function* watchFetchInventoryTurnover() {
  yield takeLatest(fetchInventoryTurnoverRequest.type, fetchInventoryTurnoverSaga);
}

function* watchFetchABCAnalysis() {
  yield takeLatest(fetchABCAnalysisRequest.type, fetchABCAnalysisSaga);
}

function* watchCalculateABCAnalysis() {
  yield takeLatest(calculateABCAnalysisRequest.type, calculateABCAnalysisSaga);
}

function* watchFetchInventoryAnalytics() {
  yield takeLatest(fetchInventoryAnalyticsRequest.type, fetchInventoryAnalyticsSaga);
}

function* watchFetchSlowMovingStock() {
  yield takeLatest(fetchSlowMovingStockRequest.type, fetchSlowMovingStockSaga);
}

function* watchFetchReorderRecommendations() {
  yield takeLatest(fetchReorderRecommendationsRequest.type, fetchReorderRecommendationsSaga);
}

// Root Saga
export default function* analyticsSaga() {
  yield all([
    watchFetchDashboard(),
    watchFetchSalesAnalytics(),
    watchFetchSalesForecast(),
    watchGenerateForecasts(),
    watchFetchInventoryTurnover(),
    watchFetchABCAnalysis(),
    watchCalculateABCAnalysis(),
    watchFetchInventoryAnalytics(),
    watchFetchSlowMovingStock(),
    watchFetchReorderRecommendations(),
  ]);
}
