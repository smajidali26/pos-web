import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import interStoreTransfersService from '../../services/interStoreTransfersService';
import {
  fetchTransfersRequest,
  fetchTransfersSuccess,
  fetchTransfersFailure,
  fetchTransferByIdRequest,
  fetchTransferByIdSuccess,
  fetchTransferByIdFailure,
  fetchPendingTransfersRequest,
  fetchPendingTransfersSuccess,
  fetchPendingTransfersFailure,
  createTransferRequest,
  createTransferSuccess,
  createTransferFailure,
  updateTransferRequest,
  updateTransferSuccess,
  updateTransferFailure,
  submitTransferRequest,
  submitTransferSuccess,
  submitTransferFailure,
  approveTransferRequest,
  approveTransferSuccess,
  approveTransferFailure,
  rejectTransferRequest,
  rejectTransferSuccess,
  rejectTransferFailure,
  shipTransferRequest,
  shipTransferSuccess,
  shipTransferFailure,
  completeTransferRequest,
  completeTransferSuccess,
  completeTransferFailure,
  cancelTransferRequest,
  cancelTransferSuccess,
  cancelTransferFailure
} from './transfersSlice';
import {
  TransfersQueryParams,
  CreateTransferRequest,
  UpdateTransferRequest,
  RejectTransferRequest,
  CancelTransferRequest
} from '../../types/interStoreTransfer';

// Fetch transfers saga
function* fetchTransfersSaga(action: PayloadAction<TransfersQueryParams | undefined>) {
  try {
    const response: Awaited<ReturnType<typeof interStoreTransfersService.getAllTransfers>> = yield call(
      interStoreTransfersService.getAllTransfers,
      action.payload || {}
    );
    yield put(fetchTransfersSuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch transfers';
    yield put(fetchTransfersFailure(errorMessage));
  }
}

// Fetch transfer by ID saga
function* fetchTransferByIdSaga(action: PayloadAction<string>) {
  try {
    const response: Awaited<ReturnType<typeof interStoreTransfersService.getTransferById>> = yield call(
      interStoreTransfersService.getTransferById,
      action.payload
    );
    yield put(fetchTransferByIdSuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch transfer';
    yield put(fetchTransferByIdFailure(errorMessage));
  }
}

// Fetch pending transfers saga
function* fetchPendingTransfersSaga() {
  try {
    const response: Awaited<ReturnType<typeof interStoreTransfersService.getPendingTransfers>> = yield call(
      interStoreTransfersService.getPendingTransfers
    );
    yield put(fetchPendingTransfersSuccess(response));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to fetch pending transfers';
    yield put(fetchPendingTransfersFailure(errorMessage));
  }
}

// Create transfer saga
function* createTransferSaga(action: PayloadAction<CreateTransferRequest>) {
  try {
    const response: Awaited<ReturnType<typeof interStoreTransfersService.createTransfer>> = yield call(
      interStoreTransfersService.createTransfer,
      action.payload
    );
    yield put(createTransferSuccess(response));
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to create transfer';
    yield put(createTransferFailure(errorMessage));
  }
}

// Update transfer saga
function* updateTransferSaga(action: PayloadAction<{ id: string; data: UpdateTransferRequest }>) {
  try {
    yield call(
      interStoreTransfersService.updateTransfer,
      action.payload.id,
      action.payload.data
    );
    yield put(updateTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload.id));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to update transfer';
    yield put(updateTransferFailure(errorMessage));
  }
}

// Submit transfer saga
function* submitTransferSaga(action: PayloadAction<string>) {
  try {
    yield call(interStoreTransfersService.submitTransfer, action.payload);
    yield put(submitTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload));
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to submit transfer';
    yield put(submitTransferFailure(errorMessage));
  }
}

// Approve transfer saga
function* approveTransferSaga(action: PayloadAction<string>) {
  try {
    yield call(interStoreTransfersService.approveTransfer, action.payload);
    yield put(approveTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload));
    // Refetch pending transfers
    yield put(fetchPendingTransfersRequest());
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to approve transfer';
    yield put(approveTransferFailure(errorMessage));
  }
}

// Reject transfer saga
function* rejectTransferSaga(action: PayloadAction<{ id: string; data: RejectTransferRequest }>) {
  try {
    yield call(
      interStoreTransfersService.rejectTransfer,
      action.payload.id,
      action.payload.data
    );
    yield put(rejectTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload.id));
    // Refetch pending transfers
    yield put(fetchPendingTransfersRequest());
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to reject transfer';
    yield put(rejectTransferFailure(errorMessage));
  }
}

// Ship transfer saga
function* shipTransferSaga(action: PayloadAction<string>) {
  try {
    yield call(interStoreTransfersService.shipTransfer, action.payload);
    yield put(shipTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload));
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to ship transfer';
    yield put(shipTransferFailure(errorMessage));
  }
}

// Complete transfer saga
function* completeTransferSaga(action: PayloadAction<string>) {
  try {
    yield call(interStoreTransfersService.completeTransfer, action.payload);
    yield put(completeTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload));
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to complete transfer';
    yield put(completeTransferFailure(errorMessage));
  }
}

// Cancel transfer saga
function* cancelTransferSaga(action: PayloadAction<{ id: string; data: CancelTransferRequest }>) {
  try {
    yield call(
      interStoreTransfersService.cancelTransfer,
      action.payload.id,
      action.payload.data
    );
    yield put(cancelTransferSuccess());
    // Refetch transfer details
    yield put(fetchTransferByIdRequest(action.payload.id));
    // Refetch transfers list
    yield put(fetchTransfersRequest({}));
  } catch (error: unknown) {
    const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
      || (error as Error)?.message
      || 'Failed to cancel transfer';
    yield put(cancelTransferFailure(errorMessage));
  }
}

// Root saga for inter-store transfers
export function* transfersSaga() {
  yield takeLatest(fetchTransfersRequest.type, fetchTransfersSaga);
  yield takeLatest(fetchTransferByIdRequest.type, fetchTransferByIdSaga);
  yield takeLatest(fetchPendingTransfersRequest.type, fetchPendingTransfersSaga);
  yield takeLatest(createTransferRequest.type, createTransferSaga);
  yield takeLatest(updateTransferRequest.type, updateTransferSaga);
  yield takeLatest(submitTransferRequest.type, submitTransferSaga);
  yield takeLatest(approveTransferRequest.type, approveTransferSaga);
  yield takeLatest(rejectTransferRequest.type, rejectTransferSaga);
  yield takeLatest(shipTransferRequest.type, shipTransferSaga);
  yield takeLatest(completeTransferRequest.type, completeTransferSaga);
  yield takeLatest(cancelTransferRequest.type, cancelTransferSaga);
}
