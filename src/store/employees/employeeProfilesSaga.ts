import { call, put, takeLatest } from 'redux-saga/effects';
import employeeProfileService from '../../services/employeeProfileService';
import {
  fetchProfilesRequest,
  fetchProfilesSuccess,
  fetchProfilesFailure,
  fetchProfileByIdRequest,
  fetchProfileByIdSuccess,
  fetchProfileByIdFailure,
  fetchProfileByUserIdRequest,
  fetchProfileByUserIdSuccess,
  fetchProfileByUserIdFailure,
  createProfileRequest,
  createProfileSuccess,
  createProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  updateCompensationRequest,
  updateCompensationSuccess,
  updateCompensationFailure,
  updateStatusRequest,
  updateStatusSuccess,
  updateStatusFailure,
  deleteProfileRequest,
  deleteProfileSuccess,
  deleteProfileFailure
} from './employeeProfilesSlice';

// Fetch profiles saga
function* fetchProfilesSaga(action: ReturnType<typeof fetchProfilesRequest>) {
  try {
    const response: Awaited<ReturnType<typeof employeeProfileService.getAll>> = yield call(
      employeeProfileService.getAll,
      action.payload
    );
    yield put(fetchProfilesSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch employee profiles';
    yield put(fetchProfilesFailure(errorMessage));
  }
}

// Fetch profile by ID saga
function* fetchProfileByIdSaga(action: ReturnType<typeof fetchProfileByIdRequest>) {
  try {
    const response: Awaited<ReturnType<typeof employeeProfileService.getById>> = yield call(
      employeeProfileService.getById,
      action.payload
    );
    yield put(fetchProfileByIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch employee profile';
    yield put(fetchProfileByIdFailure(errorMessage));
  }
}

// Fetch profile by user ID saga
function* fetchProfileByUserIdSaga(action: ReturnType<typeof fetchProfileByUserIdRequest>) {
  try {
    const response: Awaited<ReturnType<typeof employeeProfileService.getByUserId>> = yield call(
      employeeProfileService.getByUserId,
      action.payload
    );
    yield put(fetchProfileByUserIdSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch employee profile';
    yield put(fetchProfileByUserIdFailure(errorMessage));
  }
}

// Create profile saga
function* createProfileSaga(action: ReturnType<typeof createProfileRequest>) {
  try {
    const response: Awaited<ReturnType<typeof employeeProfileService.create>> = yield call(
      employeeProfileService.create,
      action.payload
    );
    yield put(createProfileSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create employee profile';
    yield put(createProfileFailure(errorMessage));
  }
}

// Update profile saga
function* updateProfileSaga(action: ReturnType<typeof updateProfileRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof employeeProfileService.update>> = yield call(
      employeeProfileService.update,
      id,
      data
    );
    yield put(updateProfileSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update employee profile';
    yield put(updateProfileFailure(errorMessage));
  }
}

// Update compensation saga
function* updateCompensationSaga(action: ReturnType<typeof updateCompensationRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof employeeProfileService.updateCompensation>> = yield call(
      employeeProfileService.updateCompensation,
      id,
      data
    );
    yield put(updateCompensationSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update compensation';
    yield put(updateCompensationFailure(errorMessage));
  }
}

// Update status saga
function* updateStatusSaga(action: ReturnType<typeof updateStatusRequest>) {
  try {
    const { id, data } = action.payload;
    const response: Awaited<ReturnType<typeof employeeProfileService.updateStatus>> = yield call(
      employeeProfileService.updateStatus,
      id,
      data
    );
    yield put(updateStatusSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update employment status';
    yield put(updateStatusFailure(errorMessage));
  }
}

// Delete profile saga
function* deleteProfileSaga(action: ReturnType<typeof deleteProfileRequest>) {
  try {
    yield call(employeeProfileService.delete, action.payload);
    yield put(deleteProfileSuccess(action.payload));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete employee profile';
    yield put(deleteProfileFailure(errorMessage));
  }
}

// Root saga for employee profiles
export function* employeeProfilesSaga() {
  yield takeLatest(fetchProfilesRequest.type, fetchProfilesSaga);
  yield takeLatest(fetchProfileByIdRequest.type, fetchProfileByIdSaga);
  yield takeLatest(fetchProfileByUserIdRequest.type, fetchProfileByUserIdSaga);
  yield takeLatest(createProfileRequest.type, createProfileSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
  yield takeLatest(updateCompensationRequest.type, updateCompensationSaga);
  yield takeLatest(updateStatusRequest.type, updateStatusSaga);
  yield takeLatest(deleteProfileRequest.type, deleteProfileSaga);
}
