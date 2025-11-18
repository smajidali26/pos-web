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
  isValid: boolean;
  user?: UserProfile;
  errorMessage?: string;
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
      // Backend will clear httpOnly cookies
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Don't throw error - logout should always succeed client-side
      // Backend may fail if token is already invalid
      console.warn('Logout request failed, but clearing client state anyway:', error);
    }
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    try {
      // Backend will read refreshToken from httpOnly cookie
      // and set new tokens as httpOnly cookies
      const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh');
      return response.data;
    } catch (error) {
      // Refresh failed, backend will clear cookies
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
      // Backend reads token from cookie, no body needed
      const response = await apiClient.post<ValidateTokenResponse>('/api/auth/validate-token', {});
      return response.data;
    } catch (error) {
      // Return invalid response instead of throwing
      // This handles cases where no cookie exists or backend returns error
      const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      console.log('Validate token error:', err.response?.status, err.response?.data);
      return {
        isValid: false,
        errorMessage: err.response?.data?.message || err.message || 'No valid session'
      };
    }
  },

  // Check if we have a valid session (by validating token)
  hasValidSession: async (): Promise<boolean> => {
    try {
      const result = await authService.validateToken();
      return result.isValid;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
