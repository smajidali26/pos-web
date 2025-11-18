import { call, put, takeLatest } from 'redux-saga/effects';
import shiftService from '../../services/shiftService';
import {
  fetchShiftsRequest,
  fetchShiftsSuccess,
  fetchShiftsFailure,
  fetchShiftByIdRequest,
  fetchShiftByIdSuccess,
  fetchShiftByIdFailure,
  fetchShiftsByEmployeeRequest,
  fetchShiftsByEmployeeSuccess,
  fetchShiftsByEmployeeFailure,
  fetchShiftsByDateRangeRequest,
  fetchShiftsByDateRangeSuccess,
  fetchShiftsByDateRangeFailure,
  fetchActiveShiftsRequest,
  fetchActiveShiftsSuccess,
  fetchActiveShiftsFailure,
  fetchUpcomingShiftsRequest,
  fetchUpcomingShiftsSuccess,
  fetchUpcomingShiftsFailure,
  createShiftRequest,
  createShiftSuccess,
  createShiftFailure,
  bulkCreateShiftsRequest,
  bulkCreateShiftsSuccess,
  bulkCreateShiftsFailure,
  updateShiftRequest,
  updateShiftSuccess,
  updateShiftFailure,
  clockInRequest,
  clockInSuccess,
  clockInFailure,
  clockOutRequest,
  clockOutSuccess,
  clockOutFailure,
  cancelShiftRequest,
  cancelShiftSuccess,
  cancelShiftFailure,
  fetchAttendanceRequest,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  deleteShiftRequest,
  deleteShiftSuccess,
  deleteShiftFailure
} from './shiftsSlice';

// Fetch shifts saga
function* fetchShiftsSaga(action: ReturnType<typeof fetchShiftsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.getAll>> = yield call(
      shiftService.getAll,
      action.payload
    );
    yield put(fetchShiftsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch shifts';
    yield put(fetchShiftsFailure(errorMessage));
  }
}

// Fetch shift by ID saga
function* fetchShiftByIdSaga(action: ReturnType<typeof fetchShiftByIdRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.getById>> = yield call(
      shiftService.getById,
      action.payload
    );
    yield put(fetchShiftByIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch shift';
    yield put(fetchShiftByIdFailure(errorMessage));
  }
}

// Fetch shifts by employee saga
function* fetchShiftsByEmployeeSaga(action: ReturnType<typeof fetchShiftsByEmployeeRequest>) {
  try {
    const { employeeId, ...params } = action.payload;
    const response: Awaited<ReturnType<typeof shiftService.getByEmployee>> = yield call(
      shiftService.getByEmployee,
      employeeId,
      params
    );
    yield put(fetchShiftsByEmployeeSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch employee shifts';
    yield put(fetchShiftsByEmployeeFailure(errorMessage));
  }
}

// Fetch shifts by date range saga
function* fetchShiftsByDateRangeSaga(action: ReturnType<typeof fetchShiftsByDateRangeRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.getByDateRange>> = yield call(
      shiftService.getByDateRange,
      action.payload
    );
    yield put(fetchShiftsByDateRangeSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch shifts';
    yield put(fetchShiftsByDateRangeFailure(errorMessage));
  }
}

// Fetch active shifts saga
function* fetchActiveShiftsSaga(action: ReturnType<typeof fetchActiveShiftsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.getActive>> = yield call(
      shiftService.getActive,
      action.payload
    );
    yield put(fetchActiveShiftsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch active shifts';
    yield put(fetchActiveShiftsFailure(errorMessage));
  }
}

// Fetch upcoming shifts saga
function* fetchUpcomingShiftsSaga(action: ReturnType<typeof fetchUpcomingShiftsRequest>) {
  try {
    const { employeeId, ...params } = action.payload;
    const response: Awaited<ReturnType<typeof shiftService.getUpcoming>> = yield call(
      shiftService.getUpcoming,
      employeeId,
      params
    );
    yield put(fetchUpcomingShiftsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch upcoming shifts';
    yield put(fetchUpcomingShiftsFailure(errorMessage));
  }
}

// Create shift saga
function* createShiftSaga(action: ReturnType<typeof createShiftRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.create>> = yield call(
      shiftService.create,
      action.payload
    );
    yield put(createShiftSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create shift';
    yield put(createShiftFailure(errorMessage));
  }
}

// Bulk create shifts saga
function* bulkCreateShiftsSaga(action: ReturnType<typeof bulkCreateShiftsRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.createBulk>> = yield call(
      shiftService.createBulk,
      action.payload
    );
    yield put(bulkCreateShiftsSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create shifts';
    yield put(bulkCreateShiftsFailure(errorMessage));
  }
}

// Update shift saga
function* updateShiftSaga(action: ReturnType<typeof updateShiftRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof shiftService.update>> = yield call(
      shiftService.update,
      id,
      data
    );
    yield put(updateShiftSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update shift';
    yield put(updateShiftFailure(errorMessage));
  }
}

// Clock in saga
function* clockInSaga(action: ReturnType<typeof clockInRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof shiftService.clockIn>> = yield call(
      shiftService.clockIn,
      id,
      data
    );
    yield put(clockInSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to clock in';
    yield put(clockInFailure(errorMessage));
  }
}

// Clock out saga
function* clockOutSaga(action: ReturnType<typeof clockOutRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof shiftService.clockOut>> = yield call(
      shiftService.clockOut,
      id,
      data
    );
    yield put(clockOutSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to clock out';
    yield put(clockOutFailure(errorMessage));
  }
}

// Cancel shift saga
function* cancelShiftSaga(action: ReturnType<typeof cancelShiftRequest>) {
  try {
    const { id, reason } = action.payload;
    const response: Awaited<ReturnType<typeof shiftService.cancel>> = yield call(
      shiftService.cancel,
      id,
      reason
    );
    yield put(cancelShiftSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel shift';
    yield put(cancelShiftFailure(errorMessage));
  }
}

// Fetch attendance saga
function* fetchAttendanceSaga(action: ReturnType<typeof fetchAttendanceRequest>) {
  try {
    const response: Awaited<ReturnType<typeof shiftService.getAttendance>> = yield call(
      shiftService.getAttendance,
      action.payload
    );
    yield put(fetchAttendanceSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch attendance';
    yield put(fetchAttendanceFailure(errorMessage));
  }
}

// Delete shift saga
function* deleteShiftSaga(action: ReturnType<typeof deleteShiftRequest>) {
  try {
    yield call(shiftService.delete, action.payload);
    yield put(deleteShiftSuccess(action.payload));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete shift';
    yield put(deleteShiftFailure(errorMessage));
  }
}

// Root saga for shifts
export function* shiftsSaga() {
  yield takeLatest(fetchShiftsRequest.type, fetchShiftsSaga);
  yield takeLatest(fetchShiftByIdRequest.type, fetchShiftByIdSaga);
  yield takeLatest(fetchShiftsByEmployeeRequest.type, fetchShiftsByEmployeeSaga);
  yield takeLatest(fetchShiftsByDateRangeRequest.type, fetchShiftsByDateRangeSaga);
  yield takeLatest(fetchActiveShiftsRequest.type, fetchActiveShiftsSaga);
  yield takeLatest(fetchUpcomingShiftsRequest.type, fetchUpcomingShiftsSaga);
  yield takeLatest(createShiftRequest.type, createShiftSaga);
  yield takeLatest(bulkCreateShiftsRequest.type, bulkCreateShiftsSaga);
  yield takeLatest(updateShiftRequest.type, updateShiftSaga);
  yield takeLatest(clockInRequest.type, clockInSaga);
  yield takeLatest(clockOutRequest.type, clockOutSaga);
  yield takeLatest(cancelShiftRequest.type, cancelShiftSaga);
  yield takeLatest(fetchAttendanceRequest.type, fetchAttendanceSaga);
  yield takeLatest(deleteShiftRequest.type, deleteShiftSaga);
}
