import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import customersService, { CreateCustomerRequest } from '../../services/customersService';
import {
  fetchCustomersRequest,
  fetchCustomersSuccess,
  fetchCustomersFailure,
  searchCustomersRequest,
  searchCustomersSuccess,
  searchCustomersFailure,
  createCustomerRequest,
  createCustomerSuccess,
  createCustomerFailure,
  updateCustomerRequest,
  updateCustomerSuccess,
  updateCustomerFailure,
  deleteCustomerRequest,
  deleteCustomerSuccess,
  deleteCustomerFailure
} from './customersSlice';

// Fetch customers saga
function* fetchCustomersSaga(action: ReturnType<typeof fetchCustomersRequest>) {
  try {
    const response: Awaited<ReturnType<typeof customersService.getAll>> = yield call(
      customersService.getAll,
      action.payload
    );
    yield put(fetchCustomersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch customers';
    yield put(fetchCustomersFailure(errorMessage));
  }
}

// Search customers saga
function* searchCustomersSaga(action: ReturnType<typeof searchCustomersRequest>) {
  try {
    if (!action.payload || action.payload.length < 2) {
      yield put(searchCustomersSuccess([]));
      return;
    }

    const response: Awaited<ReturnType<typeof customersService.search>> = yield call(
      customersService.search,
      action.payload
    );
    yield put(searchCustomersSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Search failed';
    yield put(searchCustomersFailure(errorMessage));
  }
}

// Create customer saga
function* createCustomerSaga(action: PayloadAction<CreateCustomerRequest>) {
  try {
    const response: Awaited<ReturnType<typeof customersService.create>> = yield call(
      customersService.create,
      action.payload
    );
    yield put(createCustomerSuccess(response.data));

    // Optionally show success notification
    // toast.success('Customer created successfully');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create customer';
    yield put(createCustomerFailure(errorMessage));

    // Optionally show error notification
    // toast.error(errorMessage);
  }
}

// Update customer saga
function* updateCustomerSaga(action: ReturnType<typeof updateCustomerRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof customersService.update>> = yield call(
      customersService.update,
      id,
      data
    );
    yield put(updateCustomerSuccess(response.data));

    // Optionally show success notification
    // toast.success('Customer updated successfully');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update customer';
    yield put(updateCustomerFailure(errorMessage));

    // Optionally show error notification
    // toast.error(errorMessage);
  }
}

// Delete customer saga
function* deleteCustomerSaga(action: ReturnType<typeof deleteCustomerRequest>) {
  try {
    yield call(customersService.delete, action.payload);
    yield put(deleteCustomerSuccess(action.payload));

    // Optionally show success notification
    // toast.success('Customer deleted successfully');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete customer';
    yield put(deleteCustomerFailure(errorMessage));

    // Optionally show error notification
    // toast.error(errorMessage);
  }
}

// Root saga for customers
export function* customersSaga() {
  yield takeLatest(fetchCustomersRequest.type, fetchCustomersSaga);
  yield takeLatest(searchCustomersRequest.type, searchCustomersSaga);
  yield takeLatest(createCustomerRequest.type, createCustomerSaga);
  yield takeLatest(updateCustomerRequest.type, updateCustomerSaga);
  yield takeLatest(deleteCustomerRequest.type, deleteCustomerSaga);
}
