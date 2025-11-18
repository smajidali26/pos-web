import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EmployeeProfile,
  EmploymentStatus,
  CreateEmployeeProfileRequest,
  UpdateEmployeeProfileRequest,
  UpdateCompensationRequest,
  UpdateEmploymentStatusRequest
} from '../../services/employeeProfileService';

export interface EmployeeProfilesState {
  profiles: EmployeeProfile[];
  selectedProfile: EmployeeProfile | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: EmploymentStatus;
    storeId?: string;
    managerId?: string;
    search?: string;
  };
}

const initialState: EmployeeProfilesState = {
  profiles: [],
  selectedProfile: null,
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: {}
};

const employeeProfilesSlice = createSlice({
  name: 'employeeProfiles',
  initialState,
  reducers: {
    // Fetch profiles
    fetchProfilesRequest: (state, action: PayloadAction<{
      page?: number;
      pageSize?: number;
      status?: EmploymentStatus;
      storeId?: string;
      managerId?: string;
      search?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        if (action.payload.page) state.currentPage = action.payload.page;
        if (action.payload.pageSize) state.pageSize = action.payload.pageSize;
        if (action.payload.status !== undefined) state.filters.status = action.payload.status;
        if (action.payload.storeId !== undefined) state.filters.storeId = action.payload.storeId;
        if (action.payload.managerId !== undefined) state.filters.managerId = action.payload.managerId;
        if (action.payload.search !== undefined) state.filters.search = action.payload.search;
      }
    },

    fetchProfilesSuccess: (state, action: PayloadAction<{
      items: EmployeeProfile[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.profiles = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchProfilesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch profile by ID
    fetchProfileByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchProfileByIdSuccess: (state, action: PayloadAction<EmployeeProfile>) => {
      state.selectedProfile = action.payload;
      state.isLoading = false;
    },

    fetchProfileByIdFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch profile by user ID
    fetchProfileByUserIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchProfileByUserIdSuccess: (state, action: PayloadAction<EmployeeProfile>) => {
      state.selectedProfile = action.payload;
      state.isLoading = false;
    },

    fetchProfileByUserIdFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Select profile
    selectProfile: (state, action: PayloadAction<EmployeeProfile | null>) => {
      state.selectedProfile = action.payload;
    },

    // Create profile
    createProfileRequest: (state, action: PayloadAction<CreateEmployeeProfileRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    createProfileSuccess: (state, action: PayloadAction<EmployeeProfile>) => {
      state.profiles.unshift(action.payload);
      state.totalCount += 1;
      state.isLoading = false;
    },

    createProfileFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update profile
    updateProfileRequest: (state, action: PayloadAction<{
      id: string;
      data: UpdateEmployeeProfileRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateProfileSuccess: (state, action: PayloadAction<EmployeeProfile>) => {
      const index = state.profiles.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
      if (state.selectedProfile?.id === action.payload.id) {
        state.selectedProfile = action.payload;
      }
      state.isLoading = false;
    },

    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update compensation
    updateCompensationRequest: (state, action: PayloadAction<{
      id: string;
      data: UpdateCompensationRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateCompensationSuccess: (state, action: PayloadAction<EmployeeProfile>) => {
      const index = state.profiles.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
      if (state.selectedProfile?.id === action.payload.id) {
        state.selectedProfile = action.payload;
      }
      state.isLoading = false;
    },

    updateCompensationFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update status
    updateStatusRequest: (state, action: PayloadAction<{
      id: string;
      data: UpdateEmploymentStatusRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateStatusSuccess: (state, action: PayloadAction<EmployeeProfile>) => {
      const index = state.profiles.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
      if (state.selectedProfile?.id === action.payload.id) {
        state.selectedProfile = action.payload;
      }
      state.isLoading = false;
    },

    updateStatusFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Delete profile
    deleteProfileRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteProfileSuccess: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter(p => p.id !== action.payload);
      state.totalCount -= 1;
      if (state.selectedProfile?.id === action.payload) {
        state.selectedProfile = null;
      }
      state.isLoading = false;
    },

    deleteProfileFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set page
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Set page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<EmployeeProfilesState['filters']>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    }
  }
});

export const {
  fetchProfilesRequest,
  fetchProfilesSuccess,
  fetchProfilesFailure,
  fetchProfileByIdRequest,
  fetchProfileByIdSuccess,
  fetchProfileByIdFailure,
  fetchProfileByUserIdRequest,
  fetchProfileByUserIdSuccess,
  fetchProfileByUserIdFailure,
  selectProfile,
  createProfileRequest,
  createProfileSuccess,
  createProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  updateCompensationRequest,
  updateCompensationSuccess,
  updateCompensationFailure,
  updateStatusRequest,
  updateStatusSuccess,
  updateStatusFailure,
  deleteProfileRequest,
  deleteProfileSuccess,
  deleteProfileFailure,
  clearError,
  setPage,
  setPageSize,
  setFilters,
  clearFilters
} = employeeProfilesSlice.actions;

export default employeeProfilesSlice.reducer;
