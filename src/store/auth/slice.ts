import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginResponse, TokenUpdatePayload, RestoreUserPayload, User } from './types';
import {
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
  updateToken,
  restoreUser,
  resetAuth
} from './actions';

// NOTE: With httpOnly cookies, we cannot check auth state from localStorage
// Auth state will be restored by validating the session with the backend
console.log('========================================');
console.log('AUTH SLICE INITIALIZATION');
console.log('========================================');
console.log('Using httpOnly cookie authentication');
console.log('Initial state: NOT AUTHENTICATED');
console.log('Auth state will be restored after session validation');
console.log('========================================');

const initialState: AuthState = {
  user: null,
  token: null, // Token stored in httpOnly cookie, not accessible to JS
  refreshToken: null, // RefreshToken stored in httpOnly cookie
  isAuthenticated: false, // Will be set to true after successful session validation
  isLoading: false,
  isSessionChecked: false, // Will be set to true after initial session check
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login actions
      .addCase(loginRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSuccess, (state, action: PayloadAction<LoginResponse>) => {
        console.log('Auth slice - loginSuccess reducer called with:', action.payload);
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
        state.isSessionChecked = true;
        console.log('Auth slice - new state:', { isAuthenticated: state.isAuthenticated, user: state.user });
      })
      .addCase(loginFailure, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      // Logout actions
      .addCase(logoutRequest, (state) => {
        console.log('🔴 LOGOUT REQUEST REDUCER - Setting isLoading = true');
        state.isLoading = true;
        state.error = null;
        // Don't clear auth state here - wait for logoutSuccess
        // Clearing isAuthenticated here causes immediate redirect before saga runs
      })
      .addCase(logoutSuccess, (state) => {
        console.log('✅ LOGOUT SUCCESS REDUCER - Setting isLoading = false');
        state.isLoading = false;
        state.error = null;
        // Clear auth state on logout success
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        console.log('Current state after logoutSuccess:', { isLoading: state.isLoading, isAuthenticated: state.isAuthenticated });
      })
      .addCase(logoutFailure, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
        // Still logout even if server call fails
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Refresh token actions
      .addCase(refreshTokenRequest, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshTokenSuccess, (state, action: PayloadAction<TokenUpdatePayload>) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(refreshTokenFailure, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Utility actions
      .addCase(updateToken, (state, action: PayloadAction<TokenUpdatePayload>) => {
        state.token = action.payload.token;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(restoreUser, (state, action: PayloadAction<RestoreUserPayload>) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(resetAuth, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      // Session validation actions
      // NOTE: Don't set isLoading during validation - it's a background task
      .addCase(validateSessionRequest, (state) => {
        // Don't set isLoading - session validation happens in background
        state.error = null;
      })
      .addCase(validateSessionSuccess, (state, action: PayloadAction<RestoreUserPayload>) => {
        console.log('Session validation success - restoring user:', action.payload.user);
        // Don't set isLoading - this is automatic restoration
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isSessionChecked = true;
        state.error = null;
      })
      .addCase(validateSessionFailure, (state) => {
        console.log('Session validation failed - staying unauthenticated');
        // Don't set isLoading - this is silent failure
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isSessionChecked = true;
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
