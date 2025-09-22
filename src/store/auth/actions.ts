import { createAction } from '@reduxjs/toolkit';
import { LoginCredentials, LoginResponse, TokenUpdatePayload, RestoreUserPayload } from './types';

// Auth Action Types
export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';

export const REFRESH_TOKEN_REQUEST = 'auth/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'auth/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'auth/REFRESH_TOKEN_FAILURE';

export const UPDATE_TOKEN = 'auth/UPDATE_TOKEN';
export const RESTORE_USER = 'auth/RESTORE_USER';
export const RESET_AUTH = 'auth/RESET_AUTH';

// Action Creators
export const loginRequest = createAction<LoginCredentials>(LOGIN_REQUEST);
export const loginSuccess = createAction<LoginResponse>(LOGIN_SUCCESS);
export const loginFailure = createAction<string>(LOGIN_FAILURE);

export const logoutRequest = createAction(LOGOUT_REQUEST);
export const logoutSuccess = createAction(LOGOUT_SUCCESS);
export const logoutFailure = createAction<string>(LOGOUT_FAILURE);

export const refreshTokenRequest = createAction(REFRESH_TOKEN_REQUEST);
export const refreshTokenSuccess = createAction<TokenUpdatePayload>(REFRESH_TOKEN_SUCCESS);
export const refreshTokenFailure = createAction<string>(REFRESH_TOKEN_FAILURE);

export const updateToken = createAction<TokenUpdatePayload>(UPDATE_TOKEN);
export const restoreUser = createAction<RestoreUserPayload>(RESTORE_USER);
export const resetAuth = createAction(RESET_AUTH);
