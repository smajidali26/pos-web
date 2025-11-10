// Auth Types
export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: number;
  roleName?: string;
  isActive?: boolean;
  lastLoginDate?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user?: User;
  [key: string]: any; // For additional properties that might be in the response
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionChecked: boolean; // Track if we've checked for existing session
  error: string | null;
}

export interface TokenUpdatePayload {
  token: string;
  refreshToken?: string;
}

export interface RestoreUserPayload {
  user: User;
}
