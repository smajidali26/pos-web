import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshTokenRequest, resetAuth } from '../store/auth';
import { authService } from '../services/authService';
import type { RootState, AppDispatch } from '../store';

interface JWTPayload {
  exp: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

// Function to decode JWT and check expiration
const isTokenExpiring = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const payload: JWTPayload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    // Check if token expires in the next 5 minutes (300 seconds)
    return payload.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

interface UseTokenRefreshReturn {
  manualRefresh: () => void;
  isTokenExpiring: boolean;
}

export const useTokenRefresh = (): UseTokenRefreshReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTokenRefresh = async (): Promise<void> => {
    try {
      if (!authService.hasRefreshToken()) {
        console.log('No refresh token available, logging out');
        dispatch(resetAuth());
        return;
      }

      console.log('Attempting to refresh token...');
      dispatch(refreshTokenRequest());
      console.log('Token refresh dispatched');
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch(resetAuth());
    }
  };

  const setupTokenRefreshTimer = (): void => {
    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    if (!isAuthenticated || !token) {
      return;
    }

    // Check token expiration every minute
    refreshIntervalRef.current = setInterval(() => {
      if (isTokenExpiring(token)) {
        console.log('Token is expiring, attempting refresh...');
        handleTokenRefresh();
      }
    }, 60000); // Check every minute
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      // Check immediately if token is already expiring
      if (isTokenExpiring(token)) {
        handleTokenRefresh();
      } else {
        setupTokenRefreshTimer();
      }
    } else {
      // Clear interval if not authenticated
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated, token]);

  // Manual refresh function
  const manualRefresh = (): void => {
    dispatch(refreshTokenRequest());
  };

  return {
    manualRefresh,
    isTokenExpiring: isTokenExpiring(token),
  };
};

export default useTokenRefresh;
