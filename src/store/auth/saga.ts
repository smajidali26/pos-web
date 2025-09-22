import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axios from 'axios';
import { authService } from '../../services/authService';
import {
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  REFRESH_TOKEN_REQUEST,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  logoutFailure,
  refreshTokenSuccess,
  refreshTokenFailure,
  resetAuth
} from './actions';
import { LoginCredentials, LoginResponse } from './types';

// Worker saga for login
function* loginSaga(action: PayloadAction<LoginCredentials>) {
  try {
    const { username, password } = action.payload;
    
    // Call the API
    const response: LoginResponse = yield call(
      axios.post,
      `${(window as any).__API_BASE_URL__ || 'http://localhost:5090'}/api/auth/login`,
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Store tokens in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    // Store user data in localStorage if available
    if (response.user) {
      localStorage.setItem('authUser', JSON.stringify(response.user));
    }

    // Dispatch success action
    console.log('Auth saga - dispatching loginSuccess with:', response);
    yield put(loginSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Login failed. Please try again.';
    yield put(loginFailure(errorMessage));
  }
}

// Worker saga for logout
function* logoutSaga() {
  try {
    // Call the logout service
    yield call(authService.logout);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure('Logout failed'));
    
    // Even if logout fails on server, clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    
    // Reset auth state anyway
    yield put(resetAuth());
  }
}

// Worker saga for token refresh
function* refreshTokenSaga() {
  try {
    const result: { token: string; refreshToken?: string } = yield call(authService.refreshToken);
    
    // Update localStorage with new tokens
    localStorage.setItem('authToken', result.token);
    if (result.refreshToken) {
      localStorage.setItem('refreshToken', result.refreshToken);
    }
    
    yield put(refreshTokenSuccess(result));
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Token refresh failed';
    
    // Clear tokens on refresh failure
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    
    yield put(refreshTokenFailure(errorMessage));
    yield put(resetAuth());
  }
}

// Watcher sagas
export function* watchLogin() {
  yield takeEvery(LOGIN_REQUEST, loginSaga);
}

export function* watchLogout() {
  yield takeEvery(LOGOUT_REQUEST, logoutSaga);
}

export function* watchRefreshToken() {
  yield takeLatest(REFRESH_TOKEN_REQUEST, refreshTokenSaga);
}

// Root auth saga
export function* authSaga() {
  yield* [
    watchLogin(),
    watchLogout(),
    watchRefreshToken(),
  ];
}
