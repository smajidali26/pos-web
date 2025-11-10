import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ordersService, { Order, OrderListResponse, OrderStatistics } from '../../services/ordersService';
import {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderByIdRequest,
  fetchOrderByIdSuccess,
  fetchOrderByIdFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  completeOrderRequest,
  completeOrderSuccess,
  completeOrderFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFailure,
  refundOrderRequest,
  refundOrderSuccess,
  refundOrderFailure,
  searchOrdersRequest,
  searchOrdersSuccess,
  searchOrdersFailure,
  fetchTodayOrdersRequest,
  fetchTodayOrdersSuccess,
  fetchTodayOrdersFailure,
  fetchRecentOrdersRequest,
  fetchRecentOrdersSuccess,
  fetchRecentOrdersFailure,
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure
} from './ordersSlice';

// Fetch orders saga
function* fetchOrdersSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(ordersService.getAll, action.payload);
    yield put(fetchOrdersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
    console.error('Fetch orders error:', error);
    yield put(fetchOrdersFailure(errorMessage));
  }
}

// Fetch order by ID saga
function* fetchOrderByIdSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const response = yield call(ordersService.getById, action.payload);
    yield put(fetchOrderByIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order';
    console.error('Fetch order by ID error:', error);
    yield put(fetchOrderByIdFailure(errorMessage));
  }
}

// Create order saga
function* createOrderSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(ordersService.create, action.payload);
    yield put(createOrderSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create order';
    console.error('Create order error:', error);
    yield put(createOrderFailure(errorMessage));
  }
}

// Complete order saga
function* completeOrderSaga(action: PayloadAction<{ orderId: string; paymentInfo: any }>): Generator<any, void, any> {
  try {
    const { orderId, paymentInfo } = action.payload;
    const response = yield call(ordersService.complete, orderId, paymentInfo);
    yield put(completeOrderSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to complete order';
    console.error('Complete order error:', error);
    yield put(completeOrderFailure(errorMessage));
  }
}

// Cancel order saga
function* cancelOrderSaga(action: PayloadAction<{ orderId: string; reason?: string }>): Generator<any, void, any> {
  try {
    const { orderId, reason } = action.payload;
    const response = yield call(ordersService.cancel, orderId, reason);
    yield put(cancelOrderSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel order';
    console.error('Cancel order error:', error);
    yield put(cancelOrderFailure(errorMessage));
  }
}

// Refund order saga
function* refundOrderSaga(action: PayloadAction<{ orderId: string; reason?: string }>): Generator<any, void, any> {
  try {
    const { orderId, reason } = action.payload;
    const response = yield call(ordersService.refund, orderId, reason);
    yield put(refundOrderSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to refund order';
    console.error('Refund order error:', error);
    yield put(refundOrderFailure(errorMessage));
  }
}

// Search orders saga
function* searchOrdersSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const query = action.payload;

    // Don't search if query is empty or too short
    if (!query || query.length < 2) {
      yield put(searchOrdersSuccess([]));
      return;
    }

    const response = yield call(ordersService.search, query);
    yield put(searchOrdersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to search orders';
    console.error('Search orders error:', error);
    yield put(searchOrdersFailure(errorMessage));
  }
}

// Fetch today's orders saga
function* fetchTodayOrdersSaga(): Generator<any, void, any> {
  try {
    const response = yield call(ordersService.getTodayOrders);
    yield put(fetchTodayOrdersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch today's orders";
    console.error("Fetch today's orders error:", error);
    yield put(fetchTodayOrdersFailure(errorMessage));
  }
}

// Fetch recent orders saga
function* fetchRecentOrdersSaga(action: PayloadAction<number | undefined>): Generator<any, void, any> {
  try {
    const limit = action.payload || 10;
    const response = yield call(ordersService.getRecent, limit);
    yield put(fetchRecentOrdersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch recent orders';
    console.error('Fetch recent orders error:', error);
    yield put(fetchRecentOrdersFailure(errorMessage));
  }
}

// Fetch statistics saga
function* fetchStatisticsSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(ordersService.getStatistics, action.payload);
    yield put(fetchStatisticsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order statistics';
    console.error('Fetch statistics error:', error);
    yield put(fetchStatisticsFailure(errorMessage));
  }
}

// Root saga
export function* ordersSaga() {
  yield all([
    takeLatest(fetchOrdersRequest.type, fetchOrdersSaga),
    takeLatest(fetchOrderByIdRequest.type, fetchOrderByIdSaga),
    takeLatest(createOrderRequest.type, createOrderSaga),
    takeLatest(completeOrderRequest.type, completeOrderSaga),
    takeLatest(cancelOrderRequest.type, cancelOrderSaga),
    takeLatest(refundOrderRequest.type, refundOrderSaga),
    takeLatest(searchOrdersRequest.type, searchOrdersSaga),
    takeLatest(fetchTodayOrdersRequest.type, fetchTodayOrdersSaga),
    takeLatest(fetchRecentOrdersRequest.type, fetchRecentOrdersSaga),
    takeLatest(fetchStatisticsRequest.type, fetchStatisticsSaga)
  ]);
}

export default ordersSaga;
