import apiClient from './apiClient';

// Enums
export enum EmploymentStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  OnLeave = 'OnLeave',
  Terminated = 'Terminated'
}

export enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contract = 'Contract',
  Temporary = 'Temporary'
}

// Interfaces
export interface EmployeeProfile {
  id: string;
  userId: string;
  employeeCode: string;
  hireDate: string;
  terminationDate?: string;
  status: EmploymentStatus;
  employmentType: EmploymentType;
  department?: string;
  jobTitle?: string;
  managerId?: string;
  storeId?: string;
  phoneNumber: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  hourlyRate: number;
  isEligibleForCommission: boolean;
  createdAt: string;
  updatedAt: string;
  // Related entities
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  manager?: {
    id: string;
    employeeCode: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  store?: {
    id: string;
    name: string;
  };
}

export interface CreateEmployeeProfileRequest {
  userId: string;
  employeeCode: string;
  hireDate: string;
  employmentType: EmploymentType;
  department?: string;
  jobTitle?: string;
  managerId?: string;
  storeId?: string;
  phoneNumber: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  hourlyRate: number;
  isEligibleForCommission: boolean;
}

export interface UpdateEmployeeProfileRequest {
  department?: string;
  jobTitle?: string;
  managerId?: string;
  storeId?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UpdateCompensationRequest {
  hourlyRate: number;
  isEligibleForCommission: boolean;
}

export interface UpdateEmploymentStatusRequest {
  status: EmploymentStatus;
  terminationDate?: string;
}

export interface EmployeeProfileListResponse {
  items: EmployeeProfile[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const employeeProfileService = {
  /**
   * Get all employee profiles with optional filtering
   */
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    status?: EmploymentStatus;
    storeId?: string;
    managerId?: string;
    search?: string;
  }) => apiClient.get<EmployeeProfileListResponse>('/api/employee-profiles', { params }),

  /**
   * Get employee profile by ID
   */
  getById: (id: string) =>
    apiClient.get<EmployeeProfile>(`/api/employee-profiles/${id}`),

  /**
   * Get employee profile by User ID
   */
  getByUserId: (userId: string) =>
    apiClient.get<EmployeeProfile>(`/api/employee-profiles/user/${userId}`),

  /**
   * Create new employee profile
   */
  create: (data: CreateEmployeeProfileRequest) =>
    apiClient.post<EmployeeProfile>('/api/employee-profiles', data),

  /**
   * Update employee profile
   */
  update: (id: string, data: UpdateEmployeeProfileRequest) =>
    apiClient.put<EmployeeProfile>(`/api/employee-profiles/${id}`, data),

  /**
   * Update employee compensation
   */
  updateCompensation: (id: string, data: UpdateCompensationRequest) =>
    apiClient.put<EmployeeProfile>(`/api/employee-profiles/${id}/compensation`, data),

  /**
   * Update employment status
   */
  updateStatus: (id: string, data: UpdateEmploymentStatusRequest) =>
    apiClient.put<EmployeeProfile>(`/api/employee-profiles/${id}/status`, data),

  /**
   * Delete employee profile
   */
  delete: (id: string) =>
    apiClient.delete(`/api/employee-profiles/${id}`)
};

export default employeeProfileService;
