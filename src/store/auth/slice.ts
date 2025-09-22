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
  updateToken,
  restoreUser,
  resetAuth
} from './actions';

// Check if user is already logged in (token exists)
const token = localStorage.getItem('authToken');
const refreshTokenStored = localStorage.getItem('refreshToken');
const storedUser = localStorage.getItem('authUser');

// Parse stored user data safely
let parsedUser: User | null = null;
if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser) as User;
  } catch (error) {
    console.warn('Failed to parse stored user data:', error);
    localStorage.removeItem('authUser');
  }
}

const initialState: AuthState = {
  user: parsedUser,
  token: token || null,
  refreshToken: refreshTokenStored || null,
  isAuthenticated: !!token && !!parsedUser,
  isLoading: false,
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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutSuccess, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
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
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
