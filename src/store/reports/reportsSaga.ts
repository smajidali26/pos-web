import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import reportsService from '../../services/reportsService';
import * as actions from './reportsSlice';

function* fetchDailySalesSaga(action: PayloadAction<string | undefined>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getDailySales, action.payload);
    yield put(actions.fetchDailySalesSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchDailySalesFailure(error.response?.data?.message || 'Failed to fetch daily sales'));
  }
}

function* fetchWeeklySalesSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getWeeklySales, action.payload?.weekStart, action.payload?.weekEnd);
    yield put(actions.fetchWeeklySalesSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchWeeklySalesFailure(error.response?.data?.message || 'Failed to fetch weekly sales'));
  }
}

function* fetchMonthlySalesSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getMonthlySales, action.payload?.month, action.payload?.year);
    yield put(actions.fetchMonthlySalesSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchMonthlySalesFailure(error.response?.data?.message || 'Failed to fetch monthly sales'));
  }
}

function* fetchTopProductsSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getTopProducts, action.payload?.limit, action.payload?.startDate, action.payload?.endDate);
    yield put(actions.fetchTopProductsSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchTopProductsFailure(error.response?.data?.message || 'Failed to fetch top products'));
  }
}

function* fetchCategorySalesSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getCategorySales, action.payload?.startDate, action.payload?.endDate);
    yield put(actions.fetchCategorySalesSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchCategorySalesFailure(error.response?.data?.message || 'Failed to fetch category sales'));
  }
}

function* fetchTopCustomersSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getTopCustomers, action.payload?.limit, action.payload?.startDate, action.payload?.endDate);
    yield put(actions.fetchTopCustomersSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchTopCustomersFailure(error.response?.data?.message || 'Failed to fetch top customers'));
  }
}

function* fetchHourlySalesSaga(action: PayloadAction<string | undefined>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getHourlySales, action.payload);
    yield put(actions.fetchHourlySalesSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchHourlySalesFailure(error.response?.data?.message || 'Failed to fetch hourly sales'));
  }
}

function* fetchSalesTrendSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getSalesTrend, action.payload.startDate, action.payload.endDate, action.payload.interval);
    yield put(actions.fetchSalesTrendSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchSalesTrendFailure(error.response?.data?.message || 'Failed to fetch sales trend'));
  }
}

function* fetchSummaryStatsSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(reportsService.getSummaryStats, action.payload?.startDate, action.payload?.endDate);
    yield put(actions.fetchSummaryStatsSuccess(response.data));
  } catch (error: any) {
    yield put(actions.fetchSummaryStatsFailure(error.response?.data?.message || 'Failed to fetch summary stats'));
  }
}

export function* reportsSaga() {
  yield all([
    takeLatest(actions.fetchDailySalesRequest.type, fetchDailySalesSaga),
    takeLatest(actions.fetchWeeklySalesRequest.type, fetchWeeklySalesSaga),
    takeLatest(actions.fetchMonthlySalesRequest.type, fetchMonthlySalesSaga),
    takeLatest(actions.fetchTopProductsRequest.type, fetchTopProductsSaga),
    takeLatest(actions.fetchCategorySalesRequest.type, fetchCategorySalesSaga),
    takeLatest(actions.fetchTopCustomersRequest.type, fetchTopCustomersSaga),
    takeLatest(actions.fetchHourlySalesRequest.type, fetchHourlySalesSaga),
    takeLatest(actions.fetchSalesTrendRequest.type, fetchSalesTrendSaga),
    takeLatest(actions.fetchSummaryStatsRequest.type, fetchSummaryStatsSaga)
  ]);
}

export default reportsSaga;
