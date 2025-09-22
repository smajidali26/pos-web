import apiClient from './apiClient';

// Types for authentication
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string | number;
    username: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    role?: string;
    roleName?: string;
    isActive?: boolean;
    lastLoginDate?: string;
    createdAt?: string;
  };
}

interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

interface UserProfile {
  id: string | number;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  roleName?: string;
  isActive?: boolean;
  lastLoginDate?: string;
  createdAt?: string;
}

interface ValidateTokenResponse {
  valid: boolean;
  user?: UserProfile;
  message?: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Logout request failed, but removing local tokens');
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh', {
        refreshToken: refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Update stored tokens
      localStorage.setItem('authToken', token);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return response.data;
    } catch (error) {
      // Refresh failed, clear tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/api/auth/profile');
    return response.data;
  },

  // Check if token is valid
  validateToken: async (): Promise<ValidateTokenResponse> => {
    try {
      const response = await apiClient.get<ValidateTokenResponse>('/api/auth/validate');
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  },

  // Check if we have a refresh token
  hasRefreshToken: (): boolean => {
    return !!localStorage.getItem('refreshToken');
  },
};

export default authService;
