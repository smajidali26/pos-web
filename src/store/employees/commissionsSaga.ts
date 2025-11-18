import { call, put, takeLatest } from 'redux-saga/effects';
import commissionService from '../../services/commissionService';
import {
  fetchCommissionsRequest,
  fetchCommissionsSuccess,
  fetchCommissionsFailure,
  fetchCommissionByIdRequest,
  fetchCommissionByIdSuccess,
  fetchCommissionByIdFailure,
  fetchActiveCommissionsRequest,
  fetchActiveCommissionsSuccess,
  fetchActiveCommissionsFailure,
  createCommissionRequest,
  createCommissionSuccess,
  createCommissionFailure,
  updateCommissionRequest,
  updateCommissionSuccess,
  updateCommissionFailure,
  activateCommissionRequest,
  activateCommissionSuccess,
  activateCommissionFailure,
  deactivateCommissionRequest,
  deactivateCommissionSuccess,
  deactivateCommissionFailure,
  deleteCommissionRequest,
  deleteCommissionSuccess,
  deleteCommissionFailure,
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchPendingCommissionsRequest,
  fetchPendingCommissionsSuccess,
  fetchPendingCommissionsFailure,
  fetchCommissionSummaryRequest,
  fetchCommissionSummarySuccess,
  fetchCommissionSummaryFailure,
  approveTransactionRequest,
  approveTransactionSuccess,
  approveTransactionFailure,
  voidTransactionRequest,
  voidTransactionSuccess,
  voidTransactionFailure,
  processPaymentRequest,
  processPaymentSuccess,
  processPaymentFailure
} from './commissionsSlice';

// Fetch commissions saga
function* fetchCommissionsSaga(action: ReturnType<typeof fetchCommissionsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.getAll>> = yield call(
      commissionService.getAll,
      action.payload
    );
    yield put(fetchCommissionsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch commissions';
    yield put(fetchCommissionsFailure(errorMessage));
  }
}

// Fetch commission by ID saga
function* fetchCommissionByIdSaga(action: ReturnType<typeof fetchCommissionByIdRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.getById>> = yield call(
      commissionService.getById,
      action.payload
    );
    yield put(fetchCommissionByIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch commission';
    yield put(fetchCommissionByIdFailure(errorMessage));
  }
}

// Fetch active commissions saga
function* fetchActiveCommissionsSaga(action: ReturnType<typeof fetchActiveCommissionsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.getActive>> = yield call(
      commissionService.getActive,
      action.payload
    );
    yield put(fetchActiveCommissionsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch active commissions';
    yield put(fetchActiveCommissionsFailure(errorMessage));
  }
}

// Create commission saga
function* createCommissionSaga(action: ReturnType<typeof createCommissionRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.create>> = yield call(
      commissionService.create,
      action.payload
    );
    yield put(createCommissionSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create commission';
    yield put(createCommissionFailure(errorMessage));
  }
}

// Update commission saga
function* updateCommissionSaga(action: ReturnType<typeof updateCommissionRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof commissionService.update>> = yield call(
      commissionService.update,
      id,
      data
    );
    yield put(updateCommissionSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update commission';
    yield put(updateCommissionFailure(errorMessage));
  }
}

// Activate commission saga
function* activateCommissionSaga(action: ReturnType<typeof activateCommissionRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.activate>> = yield call(
      commissionService.activate,
      action.payload
    );
    yield put(activateCommissionSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to activate commission';
    yield put(activateCommissionFailure(errorMessage));
  }
}

// Deactivate commission saga
function* deactivateCommissionSaga(action: ReturnType<typeof deactivateCommissionRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.deactivate>> = yield call(
      commissionService.deactivate,
      action.payload
    );
    yield put(deactivateCommissionSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to deactivate commission';
    yield put(deactivateCommissionFailure(errorMessage));
  }
}

// Delete commission saga
function* deleteCommissionSaga(action: ReturnType<typeof deleteCommissionRequest>) {
  try {
    yield call(commissionService.delete, action.payload);
    yield put(deleteCommissionSuccess(action.payload));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete commission';
    yield put(deleteCommissionFailure(errorMessage));
  }
}

// Fetch transactions saga
function* fetchTransactionsSaga(action: ReturnType<typeof fetchTransactionsRequest>) {
  try {
    const { employeeId, ...params } = action.payload;
    const response: Awaited<ReturnType<typeof commissionService.getTransactions>> = yield call(
      commissionService.getTransactions,
      employeeId,
      params
    );
    yield put(fetchTransactionsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch transactions';
    yield put(fetchTransactionsFailure(errorMessage));
  }
}

// Fetch pending commissions saga
function* fetchPendingCommissionsSaga(action: ReturnType<typeof fetchPendingCommissionsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.getPendingCommissions>> = yield call(
      commissionService.getPendingCommissions,
      action.payload
    );
    yield put(fetchPendingCommissionsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch pending commissions';
    yield put(fetchPendingCommissionsFailure(errorMessage));
  }
}

// Fetch commission summary saga
function* fetchCommissionSummarySaga(action: ReturnType<typeof fetchCommissionSummaryRequest>) {
  try {
    const { employeeId, ...params } = action.payload;
    const response: Awaited<ReturnType<typeof commissionService.getSummary>> = yield call(
      commissionService.getSummary,
      employeeId,
      params
    );
    yield put(fetchCommissionSummarySuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch commission summary';
    yield put(fetchCommissionSummaryFailure(errorMessage));
  }
}

// Approve transaction saga
function* approveTransactionSaga(action: ReturnType<typeof approveTransactionRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.approveTransaction>> = yield call(
      commissionService.approveTransaction,
      action.payload
    );
    yield put(approveTransactionSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to approve transaction';
    yield put(approveTransactionFailure(errorMessage));
  }
}

// Void transaction saga
function* voidTransactionSaga(action: ReturnType<typeof voidTransactionRequest>) {
  try {
    const { transactionId, reason } = action.payload;
    const response: Awaited<ReturnType<typeof commissionService.voidTransaction>> = yield call(
      commissionService.voidTransaction,
      transactionId,
      reason
    );
    yield put(voidTransactionSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to void transaction';
    yield put(voidTransactionFailure(errorMessage));
  }
}

// Process payment saga
function* processPaymentSaga(action: ReturnType<typeof processPaymentRequest>) {
  try {
    const response: Awaited<ReturnType<typeof commissionService.processPayment>> = yield call(
      commissionService.processPayment,
      action.payload
    );
    yield put(processPaymentSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to process payment';
    yield put(processPaymentFailure(errorMessage));
  }
}

// Root saga for commissions
export function* commissionsSaga() {
  yield takeLatest(fetchCommissionsRequest.type, fetchCommissionsSaga);
  yield takeLatest(fetchCommissionByIdRequest.type, fetchCommissionByIdSaga);
  yield takeLatest(fetchActiveCommissionsRequest.type, fetchActiveCommissionsSaga);
  yield takeLatest(createCommissionRequest.type, createCommissionSaga);
  yield takeLatest(updateCommissionRequest.type, updateCommissionSaga);
  yield takeLatest(activateCommissionRequest.type, activateCommissionSaga);
  yield takeLatest(deactivateCommissionRequest.type, deactivateCommissionSaga);
  yield takeLatest(deleteCommissionRequest.type, deleteCommissionSaga);
  yield takeLatest(fetchTransactionsRequest.type, fetchTransactionsSaga);
  yield takeLatest(fetchPendingCommissionsRequest.type, fetchPendingCommissionsSaga);
  yield takeLatest(fetchCommissionSummaryRequest.type, fetchCommissionSummarySaga);
  yield takeLatest(approveTransactionRequest.type, approveTransactionSaga);
  yield takeLatest(voidTransactionRequest.type, voidTransactionSaga);
  yield takeLatest(processPaymentRequest.type, processPaymentSaga);
}
