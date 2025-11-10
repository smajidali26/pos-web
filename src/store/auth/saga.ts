import { call, put, takeEvery, takeLatest, all, fork } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axios from 'axios';
import { authService } from '../../services/authService';
import {
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  REFRESH_TOKEN_REQUEST,
  VALIDATE_SESSION_REQUEST,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  validateSessionRequest,
  validateSessionSuccess,
  validateSessionFailure,
  resetAuth
} from './actions';
import { LoginCredentials, LoginResponse } from './types';

// Worker saga for login
function* loginSaga(action: PayloadAction<LoginCredentials>) {
  try {
    const { username, password } = action.payload;

    // Import apiClient dynamically to avoid circular dependencies
    const { default: apiClient } = yield import('../../services/apiClient');

    // Call the API using apiClient (has withCredentials: true for cookies)
    const axiosResponse: { data: LoginResponse } = yield call(
      apiClient.post,
      '/api/auth/login',
      { username, password }
    );

    // Extract the actual response data
    const apiResponse = axiosResponse.data;
    console.log('========================================');
    console.log('AUTH SAGA - API RESPONSE RECEIVED');
    console.log('========================================');
    console.log('Full response:', apiResponse);
    console.log('Response has isSuccess:', apiResponse.isSuccess);
    console.log('Response has token:', !!apiResponse.token);
    console.log('Response has user:', !!apiResponse.user);

    // Extract user from response
    // NOTE: Token is now stored in httpOnly cookie by backend
    const user = apiResponse.user;

    // Validate we have what we need
    if (!user) {
      console.error('❌ CRITICAL: No user data in response!');
      throw new Error('No user data received from server');
    }

    console.log('✅ Login successful - cookies set by backend');

    // Clear session flags since we now have a valid cookie
    sessionStorage.removeItem('explicitLogout');
    sessionStorage.removeItem('noSessionCookie');

    // Create response for Redux action
    const response: LoginResponse = {
      token: '', // Token is in httpOnly cookie, not needed in Redux
      refreshToken: undefined,
      user: user
    };

    // Dispatch success action
     yield put(loginSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Login failed. Please try again.';
    yield put(loginFailure(errorMessage));
  }
}

// Worker saga for logout
function* logoutSaga() {
  console.log('========================================');
  console.log('🔴 LOGOUT SAGA STARTED');
  console.log('========================================');

  try {
    console.log('Logout saga - Calling logout service');
    yield call(authService.logout);
    console.log('✅ Logout saga - Logout service completed successfully');

    // Mark that user explicitly logged out (prevents auto-validation on next page load)
    sessionStorage.setItem('explicitLogout', 'true');
    console.log('Logout saga - Set explicitLogout flag in sessionStorage');

    console.log('Logout saga - Dispatching logoutSuccess');
    yield put(logoutSuccess());
    console.log('✅ LOGOUT SUCCESS DISPATCHED');

    // Navigate to login page to clear current page URL
    // This ensures next login redirects to correct page for new role
    console.log('Logout saga - Navigating to /login');
    window.location.href = '/login';

    console.log('========================================');
  } catch (error) {
    console.error('❌ Logout saga - Error during logout:', error);
    yield put(logoutFailure('Logout failed'));

    // Reset auth state anyway
    console.log('Logout saga - Resetting auth state');
    yield put(resetAuth());
    console.log('========================================');
  }
}

// Worker saga for token refresh
function* refreshTokenSaga() {
  try {
    // Backend reads refreshToken from httpOnly cookie
    // and sets new tokens as httpOnly cookies
    const result: { token: string; refreshToken?: string } = yield call(authService.refreshToken);

    console.log('✅ Token refresh successful - new cookies set by backend');

    yield put(refreshTokenSuccess(result));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Token refresh failed';

    console.error('❌ Token refresh failed - backend will clear cookies');

    yield put(refreshTokenFailure(errorMessage));
    yield put(resetAuth());
  }
}

// Worker saga for session validation
function* validateSessionSaga() {
  try {
    console.log('🔍 Validating session from cookie...');

    // Call validate endpoint which reads token from cookie
    const result: { isValid: boolean; user?: any; errorMessage?: string } = yield call(authService.validateToken);

    if (result.isValid && result.user) {
      console.log('✅ Session valid - restoring user:', result.user);
      // Clear the noSessionCookie flag since we have a valid cookie
      sessionStorage.removeItem('noSessionCookie');
      yield put(validateSessionSuccess({ user: result.user }));
    } else {
      console.log('❌ Session invalid or expired:', result.errorMessage);
      // Set flag to prevent future validation attempts in this session
      sessionStorage.setItem('noSessionCookie', 'true');
      yield put(validateSessionFailure());
    }
  } catch (error) {
    console.error('❌ Session validation failed:', error);
    // Set flag to prevent future validation attempts in this session
    sessionStorage.setItem('noSessionCookie', 'true');
    yield put(validateSessionFailure());
  }
}

// Watcher sagas
export function* watchLogin() {
  console.log('Registering login watcher for:', LOGIN_REQUEST);
  console.log('Login action type:', loginRequest.type);
  yield takeEvery(loginRequest.type, loginSaga);
}

export function* watchLogout() {
  console.log('Registering logout watcher for:', LOGOUT_REQUEST);
  console.log('Logout action type:', logoutRequest.type);
  yield takeEvery(logoutRequest.type, logoutSaga);
}

export function* watchRefreshToken() {
  console.log('Registering refresh token watcher for:', REFRESH_TOKEN_REQUEST);
  console.log('Refresh token action type:', refreshTokenRequest.type);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
}

export function* watchValidateSession() {
  console.log('Registering validate session watcher for:', VALIDATE_SESSION_REQUEST);
  console.log('Validate session action type:', validateSessionRequest.type);
  yield takeLatest(validateSessionRequest.type, validateSessionSaga);
}

// Root auth saga
export function* authSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchRefreshToken),
    fork(watchValidateSession),
  ]);
}
