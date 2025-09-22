import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, logoutRequest, resetAuth } from '../store/auth';
import { clearError } from '../store/auth/slice';
import type { RootState, AppDispatch } from '../store';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Auth state
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  // Auth actions
  const login = (credentials: LoginCredentials) => {
    dispatch(loginRequest(credentials));
  };
  
  const logout = () => {
    dispatch(logoutRequest());
  };
  
  const clearAuthError = () => {
    dispatch(clearError());
  };
  
  const resetAuthentication = () => {
    dispatch(resetAuth());
  };
  
  // Helper functions
  const isTokenValid = (): boolean => {
    if (!token) return false;
    
    try {
      // Basic token validation - you might want to check expiration here
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return tokenData.exp > currentTime;
    } catch {
      return false;
    }
  };
  
  const getAuthHeader = (): { Authorization?: string } => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    clearAuthError,
    resetAuthentication,
    
    // Helpers
    isTokenValid,
    getAuthHeader,
  };
};

export default useAuth;
