import apiClient from './apiClient';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number; // 0=Cashier, 1=Manager, 2=Administrator, 3=Owner
}

export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  isActive: boolean;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

const usersService = {
  // Change password for current user
  changePassword: (request: ChangePasswordRequest) => {
    return apiClient.post('/api/Users/change-password', request);
  },

  // Get all users (Owner/Admin only)
  getAllUsers: () => {
    return apiClient.get('/api/Users');
  },

  // Create new user (Owner only)
  createUser: (request: CreateUserRequest) => {
    return apiClient.post('/api/Users', request);
  },

  // Update user (Owner only)
  updateUser: (id: string, request: UpdateUserRequest) => {
    return apiClient.put(`/api/Users/${id}`, request);
  },

  // Activate/Deactivate user (Owner only)
  toggleUserStatus: (id: string, isActive: boolean) => {
    return apiClient.patch(`/api/Users/${id}/status`, { isActive });
  },

  // Reset user password (Owner only - no current password required)
  resetPassword: (request: ResetPasswordRequest) => {
    return apiClient.post('/api/Users/reset-password', request);
  },
};

export default usersService;
