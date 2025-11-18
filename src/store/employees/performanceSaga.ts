import { call, put, takeLatest } from 'redux-saga/effects';
import performanceService from '../../services/performanceService';
import {
  fetchMetricsByEmployeeRequest,
  fetchMetricsByEmployeeSuccess,
  fetchMetricsByEmployeeFailure,
  fetchMetricByIdRequest,
  fetchMetricByIdSuccess,
  fetchMetricByIdFailure,
  fetchMetricsByPeriodRequest,
  fetchMetricsByPeriodSuccess,
  fetchMetricsByPeriodFailure,
  fetchTopPerformersRequest,
  fetchTopPerformersSuccess,
  fetchTopPerformersFailure,
  fetchComparisonRequest,
  fetchComparisonSuccess,
  fetchComparisonFailure,
  fetchTrendsRequest,
  fetchTrendsSuccess,
  fetchTrendsFailure,
  calculateMetricsRequest,
  calculateMetricsSuccess,
  calculateMetricsFailure,
  updateCustomerRatingRequest,
  updateCustomerRatingSuccess,
  updateCustomerRatingFailure,
  recalculateAllMetricsRequest,
  recalculateAllMetricsSuccess,
  recalculateAllMetricsFailure
} from './performanceSlice';

// Fetch metrics by employee saga
function* fetchMetricsByEmployeeSaga(action: ReturnType<typeof fetchMetricsByEmployeeRequest>) {
  try {
    const { employeeId, ...params } = action.payload;
    const response: Awaited<ReturnType<typeof performanceService.getByEmployee>> = yield call(
      performanceService.getByEmployee,
      employeeId,
      params
    );
    yield put(fetchMetricsByEmployeeSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch performance metrics';
    yield put(fetchMetricsByEmployeeFailure(errorMessage));
  }
}

// Fetch metric by ID saga
function* fetchMetricByIdSaga(action: ReturnType<typeof fetchMetricByIdRequest>) {
  try {
    const response: Awaited<ReturnType<typeof performanceService.getById>> = yield call(
      performanceService.getById,
      action.payload
    );
    yield put(fetchMetricByIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch performance metric';
    yield put(fetchMetricByIdFailure(errorMessage));
  }
}

// Fetch metrics by period saga
function* fetchMetricsByPeriodSaga(action: ReturnType<typeof fetchMetricsByPeriodRequest>) {
  try {
    const response: Awaited<ReturnType<typeof performanceService.getByPeriod>> = yield call(
      performanceService.getByPeriod,
      action.payload
    );
    yield put(fetchMetricsByPeriodSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch performance metrics';
    yield put(fetchMetricsByPeriodFailure(errorMessage));
  }
}

// Fetch top performers saga
function* fetchTopPerformersSaga(action: ReturnType<typeof fetchTopPerformersRequest>) {
  try {
    const response: Awaited<ReturnType<typeof performanceService.getTopPerformers>> = yield call(
      performanceService.getTopPerformers,
      action.payload
    );
    yield put(fetchTopPerformersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch top performers';
    yield put(fetchTopPerformersFailure(errorMessage));
  }
}

// Fetch comparison saga
function* fetchComparisonSaga(action: ReturnType<typeof fetchComparisonRequest>) {
  try {
    const response: Awaited<ReturnType<typeof performanceService.getComparison>> = yield call(
      performanceService.getComparison,
      action.payload
    );
    yield put(fetchComparisonSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch performance comparison';
    yield put(fetchComparisonFailure(errorMessage));
  }
}

// Fetch trends saga
function* fetchTrendsSaga(action: ReturnType<typeof fetchTrendsRequest>) {
  try {
    const { employeeId, ...params } = action.payload;
    const response: Awaited<ReturnType<typeof performanceService.getTrends>> = yield call(
      performanceService.getTrends,
      employeeId,
      params
    );
    yield put(fetchTrendsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch performance trends';
    yield put(fetchTrendsFailure(errorMessage));
  }
}

// Calculate metrics saga
function* calculateMetricsSaga(action: ReturnType<typeof calculateMetricsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof performanceService.calculate>> = yield call(
      performanceService.calculate,
      action.payload
    );
    yield put(calculateMetricsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to calculate metrics';
    yield put(calculateMetricsFailure(errorMessage));
  }
}

// Update customer rating saga
function* updateCustomerRatingSaga(action: ReturnType<typeof updateCustomerRatingRequest>) {
  try {
    const response: Awaited<ReturnType<typeof performanceService.updateCustomerRating>> = yield call(
      performanceService.updateCustomerRating,
      action.payload
    );
    yield put(updateCustomerRatingSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update customer rating';
    yield put(updateCustomerRatingFailure(errorMessage));
  }
}

// Recalculate all metrics saga
function* recalculateAllMetricsSaga(action: ReturnType<typeof recalculateAllMetricsRequest>) {
  try {
    yield call(
      performanceService.recalculateAll,
      action.payload
    );
    yield put(recalculateAllMetricsSuccess());
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to recalculate metrics';
    yield put(recalculateAllMetricsFailure(errorMessage));
  }
}

// Root saga for performance
export function* performanceSaga() {
  yield takeLatest(fetchMetricsByEmployeeRequest.type, fetchMetricsByEmployeeSaga);
  yield takeLatest(fetchMetricByIdRequest.type, fetchMetricByIdSaga);
  yield takeLatest(fetchMetricsByPeriodRequest.type, fetchMetricsByPeriodSaga);
  yield takeLatest(fetchTopPerformersRequest.type, fetchTopPerformersSaga);
  yield takeLatest(fetchComparisonRequest.type, fetchComparisonSaga);
  yield takeLatest(fetchTrendsRequest.type, fetchTrendsSaga);
  yield takeLatest(calculateMetricsRequest.type, calculateMetricsSaga);
  yield takeLatest(updateCustomerRatingRequest.type, updateCustomerRatingSaga);
  yield takeLatest(recalculateAllMetricsRequest.type, recalculateAllMetricsSaga);
}
