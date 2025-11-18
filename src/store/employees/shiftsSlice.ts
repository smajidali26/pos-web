import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Shift,
  ShiftStatus,
  ShiftAttendance,
  CreateShiftRequest,
  UpdateShiftRequest,
  BulkCreateShiftsRequest,
  ClockInRequest,
  ClockOutRequest
} from '../../services/shiftService';

export interface ShiftsState {
  shifts: Shift[];
  selectedShift: Shift | null;
  activeShifts: Shift[];
  upcomingShifts: Shift[];
  attendanceEvents: ShiftAttendance[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    employeeProfileId?: string;
    storeId?: string;
    status?: ShiftStatus;
    startDate?: string;
    endDate?: string;
  };
}

const initialState: ShiftsState = {
  shifts: [],
  selectedShift: null,
  activeShifts: [],
  upcomingShifts: [],
  attendanceEvents: [],
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: {}
};

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    // Fetch shifts
    fetchShiftsRequest: (state, action: PayloadAction<{
      page?: number;
      pageSize?: number;
      employeeProfileId?: string;
      storeId?: string;
      status?: ShiftStatus;
      startDate?: string;
      endDate?: string;
    } | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        if (action.payload.page) state.currentPage = action.payload.page;
        if (action.payload.pageSize) state.pageSize = action.payload.pageSize;
        if (action.payload.employeeProfileId !== undefined) state.filters.employeeProfileId = action.payload.employeeProfileId;
        if (action.payload.storeId !== undefined) state.filters.storeId = action.payload.storeId;
        if (action.payload.status !== undefined) state.filters.status = action.payload.status;
        if (action.payload.startDate !== undefined) state.filters.startDate = action.payload.startDate;
        if (action.payload.endDate !== undefined) state.filters.endDate = action.payload.endDate;
      }
    },

    fetchShiftsSuccess: (state, action: PayloadAction<{
      items: Shift[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.shifts = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchShiftsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch shift by ID
    fetchShiftByIdRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchShiftByIdSuccess: (state, action: PayloadAction<Shift>) => {
      state.selectedShift = action.payload;
      state.isLoading = false;
    },

    fetchShiftByIdFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch shifts by employee
    fetchShiftsByEmployeeRequest: (state, action: PayloadAction<{
      employeeId: string;
      page?: number;
      pageSize?: number;
      startDate?: string;
      endDate?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchShiftsByEmployeeSuccess: (state, action: PayloadAction<{
      items: Shift[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>) => {
      state.shifts = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    },

    fetchShiftsByEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch shifts by date range
    fetchShiftsByDateRangeRequest: (state, action: PayloadAction<{
      startDate: string;
      endDate: string;
      employeeProfileId?: string;
      storeId?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchShiftsByDateRangeSuccess: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload;
      state.isLoading = false;
    },

    fetchShiftsByDateRangeFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch active shifts
    fetchActiveShiftsRequest: (state, action: PayloadAction<{ storeId?: string } | undefined>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchActiveShiftsSuccess: (state, action: PayloadAction<Shift[]>) => {
      state.activeShifts = action.payload;
      state.isLoading = false;
    },

    fetchActiveShiftsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch upcoming shifts
    fetchUpcomingShiftsRequest: (state, action: PayloadAction<{
      employeeId: string;
      days?: number;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchUpcomingShiftsSuccess: (state, action: PayloadAction<Shift[]>) => {
      state.upcomingShifts = action.payload;
      state.isLoading = false;
    },

    fetchUpcomingShiftsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Select shift
    selectShift: (state, action: PayloadAction<Shift | null>) => {
      state.selectedShift = action.payload;
    },

    // Create shift
    createShiftRequest: (state, action: PayloadAction<CreateShiftRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    createShiftSuccess: (state, action: PayloadAction<Shift>) => {
      state.shifts.unshift(action.payload);
      state.totalCount += 1;
      state.isLoading = false;
    },

    createShiftFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Bulk create shifts
    bulkCreateShiftsRequest: (state, action: PayloadAction<BulkCreateShiftsRequest>) => {
      state.isLoading = true;
      state.error = null;
    },

    bulkCreateShiftsSuccess: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = [...action.payload, ...state.shifts];
      state.totalCount += action.payload.length;
      state.isLoading = false;
    },

    bulkCreateShiftsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Update shift
    updateShiftRequest: (state, action: PayloadAction<{
      id: string;
      data: UpdateShiftRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    updateShiftSuccess: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.shifts[index] = action.payload;
      }
      if (state.selectedShift?.id === action.payload.id) {
        state.selectedShift = action.payload;
      }
      state.isLoading = false;
    },

    updateShiftFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clock in
    clockInRequest: (state, action: PayloadAction<{
      id: string;
      data?: ClockInRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    clockInSuccess: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.shifts[index] = action.payload;
      }
      if (state.selectedShift?.id === action.payload.id) {
        state.selectedShift = action.payload;
      }
      // Update active shifts
      const activeIndex = state.activeShifts.findIndex(s => s.id === action.payload.id);
      if (activeIndex !== -1) {
        state.activeShifts[activeIndex] = action.payload;
      } else {
        state.activeShifts.push(action.payload);
      }
      state.isLoading = false;
    },

    clockInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clock out
    clockOutRequest: (state, action: PayloadAction<{
      id: string;
      data?: ClockOutRequest;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    clockOutSuccess: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.shifts[index] = action.payload;
      }
      if (state.selectedShift?.id === action.payload.id) {
        state.selectedShift = action.payload;
      }
      // Remove from active shifts
      state.activeShifts = state.activeShifts.filter(s => s.id !== action.payload.id);
      state.isLoading = false;
    },

    clockOutFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Cancel shift
    cancelShiftRequest: (state, action: PayloadAction<{
      id: string;
      reason?: string;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },

    cancelShiftSuccess: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.shifts[index] = action.payload;
      }
      if (state.selectedShift?.id === action.payload.id) {
        state.selectedShift = action.payload;
      }
      state.isLoading = false;
    },

    cancelShiftFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Fetch attendance
    fetchAttendanceRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchAttendanceSuccess: (state, action: PayloadAction<ShiftAttendance[]>) => {
      state.attendanceEvents = action.payload;
      state.isLoading = false;
    },

    fetchAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Delete shift
    deleteShiftRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteShiftSuccess: (state, action: PayloadAction<string>) => {
      state.shifts = state.shifts.filter(s => s.id !== action.payload);
      state.totalCount -= 1;
      if (state.selectedShift?.id === action.payload) {
        state.selectedShift = null;
      }
      state.isLoading = false;
    },

    deleteShiftFailure: (state, action: PayloadAction<string>) => {
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
    setFilters: (state, action: PayloadAction<ShiftsState['filters']>) => {
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
  fetchShiftsRequest,
  fetchShiftsSuccess,
  fetchShiftsFailure,
  fetchShiftByIdRequest,
  fetchShiftByIdSuccess,
  fetchShiftByIdFailure,
  fetchShiftsByEmployeeRequest,
  fetchShiftsByEmployeeSuccess,
  fetchShiftsByEmployeeFailure,
  fetchShiftsByDateRangeRequest,
  fetchShiftsByDateRangeSuccess,
  fetchShiftsByDateRangeFailure,
  fetchActiveShiftsRequest,
  fetchActiveShiftsSuccess,
  fetchActiveShiftsFailure,
  fetchUpcomingShiftsRequest,
  fetchUpcomingShiftsSuccess,
  fetchUpcomingShiftsFailure,
  selectShift,
  createShiftRequest,
  createShiftSuccess,
  createShiftFailure,
  bulkCreateShiftsRequest,
  bulkCreateShiftsSuccess,
  bulkCreateShiftsFailure,
  updateShiftRequest,
  updateShiftSuccess,
  updateShiftFailure,
  clockInRequest,
  clockInSuccess,
  clockInFailure,
  clockOutRequest,
  clockOutSuccess,
  clockOutFailure,
  cancelShiftRequest,
  cancelShiftSuccess,
  cancelShiftFailure,
  fetchAttendanceRequest,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  deleteShiftRequest,
  deleteShiftSuccess,
  deleteShiftFailure,
  clearError,
  setPage,
  setPageSize,
  setFilters,
  clearFilters
} = shiftsSlice.actions;

export default shiftsSlice.reducer;
