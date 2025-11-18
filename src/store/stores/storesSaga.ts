import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import storesService from '../../services/storesService';
import {
  fetchStoresRequest,
  fetchStoresSuccess,
  fetchStoresFailure,
  fetchStoreByIdRequest,
  fetchStoreByIdSuccess,
  fetchStoreByIdFailure,
  fetchStoreHierarchyRequest,
  fetchStoreHierarchySuccess,
  fetchStoreHierarchyFailure,
  fetchStoreInventoryRequest,
  fetchStoreInventorySuccess,
  fetchStoreInventoryFailure,
  fetchStoreSummaryRequest,
  fetchStoreSummarySuccess,
  fetchStoreSummaryFailure,
  createStoreRequest,
  createStoreSuccess,
  createStoreFailure,
  updateStoreRequest,
  updateStoreSuccess,
  updateStoreFailure,
  activateStoreRequest,
  activateStoreSuccess,
  activateStoreFailure,
  deactivateStoreRequest,
  deactivateStoreSuccess,
  deactivateStoreFailure
} from './storesSlice';
import { StoresQueryParams, CreateStoreRequest, UpdateStoreRequest } from '../../types/store';

// Fetch stores saga
function* fetchStoresSaga(action: PayloadAction<StoresQueryParams | undefined>) {
  try {
    const response: Awaited<ReturnType<typeof storesService.getAllStores>> = yield call(
      storesService.getAllStores,
      action.payload || {}
    );
    yield put(fetchStoresSuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch stores';
    yield put(fetchStoresFailure(errorMessage));
  }
}

// Fetch store by ID saga
function* fetchStoreByIdSaga(action: PayloadAction<string>) {
  try {
    const response: Awaited<ReturnType<typeof storesService.getStoreById>> = yield call(
      storesService.getStoreById,
      action.payload
    );
    yield put(fetchStoreByIdSuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch store';
    yield put(fetchStoreByIdFailure(errorMessage));
  }
}

// Fetch store hierarchy saga
function* fetchStoreHierarchySaga() {
  try {
    const response: Awaited<ReturnType<typeof storesService.getStoreHierarchy>> = yield call(
      storesService.getStoreHierarchy
    );
    yield put(fetchStoreHierarchySuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch store hierarchy';
    yield put(fetchStoreHierarchyFailure(errorMessage));
  }
}

// Fetch store inventory saga
function* fetchStoreInventorySaga(action: PayloadAction<string>) {
  try {
    const response: Awaited<ReturnType<typeof storesService.getStoreInventory>> = yield call(
      storesService.getStoreInventory,
      action.payload
    );
    yield put(fetchStoreInventorySuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch store inventory';
    yield put(fetchStoreInventoryFailure(errorMessage));
  }
}

// Fetch store summary saga
function* fetchStoreSummarySaga(action: PayloadAction<string>) {
  try {
    const response: Awaited<ReturnType<typeof storesService.getStoreSummary>> = yield call(
      storesService.getStoreSummary,
      action.payload
    );
    yield put(fetchStoreSummarySuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch store summary';
    yield put(fetchStoreSummaryFailure(errorMessage));
  }
}

// Create store saga
function* createStoreSaga(action: PayloadAction<CreateStoreRequest>) {
  try {
    const response: Awaited<ReturnType<typeof storesService.createStore>> = yield call(
      storesService.createStore,
      action.payload
    );
    yield put(createStoreSuccess(response));
    // Refetch stores list
    yield put(fetchStoresRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to create store';
    yield put(createStoreFailure(errorMessage));
  }
}

// Update store saga
function* updateStoreSaga(action: PayloadAction<{ id: string; data: UpdateStoreRequest }>) {
  try {
    yield call(
      storesService.updateStore,
      action.payload.id,
      action.payload.data
    );
    yield put(updateStoreSuccess());
    // Refetch stores list
    yield put(fetchStoresRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to update store';
    yield put(updateStoreFailure(errorMessage));
  }
}

// Activate store saga
function* activateStoreSaga(action: PayloadAction<string>) {
  try {
    yield call(storesService.activateStore, action.payload);
    yield put(activateStoreSuccess(action.payload));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to activate store';
    yield put(activateStoreFailure(errorMessage));
  }
}

// Deactivate store saga
function* deactivateStoreSaga(action: PayloadAction<string>) {
  try {
    yield call(storesService.deactivateStore, action.payload);
    yield put(deactivateStoreSuccess(action.payload));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to deactivate store';
    yield put(deactivateStoreFailure(errorMessage));
  }
}

// Root saga for stores
export function* storesSaga() {
  yield takeLatest(fetchStoresRequest.type, fetchStoresSaga);
  yield takeLatest(fetchStoreByIdRequest.type, fetchStoreByIdSaga);
  yield takeLatest(fetchStoreHierarchyRequest.type, fetchStoreHierarchySaga);
  yield takeLatest(fetchStoreInventoryRequest.type, fetchStoreInventorySaga);
  yield takeLatest(fetchStoreSummaryRequest.type, fetchStoreSummarySaga);
  yield takeLatest(createStoreRequest.type, createStoreSaga);
  yield takeLatest(updateStoreRequest.type, updateStoreSaga);
  yield takeLatest(activateStoreRequest.type, activateStoreSaga);
  yield takeLatest(deactivateStoreRequest.type, deactivateStoreSaga);
}
