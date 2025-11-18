import apiClient from './apiClient';

// Enums
export enum ShiftStatus {
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow'
}

export enum AttendanceEventType {
  ClockIn = 'ClockIn',
  ClockOut = 'ClockOut',
  BreakStart = 'BreakStart',
  BreakEnd = 'BreakEnd'
}

// Interfaces
export interface Shift {
  id: string;
  employeeProfileId: string;
  storeId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: ShiftStatus;
  scheduledBreakMinutes: number;
  actualBreakMinutes: number;
  totalSales?: number;
  ordersProcessed?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  employeeProfile?: {
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
  attendanceEvents?: ShiftAttendance[];
}

export interface ShiftAttendance {
  id: string;
  shiftId: string;
  eventType: AttendanceEventType;
  timestamp: string;
  notes?: string;
  location?: string;
  device?: string;
  createdAt: string;
}

export interface CreateShiftRequest {
  employeeProfileId: string;
  storeId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  scheduledBreakMinutes: number;
  notes?: string;
}

export interface UpdateShiftRequest {
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  scheduledBreakMinutes?: number;
  notes?: string;
}

export interface BulkCreateShiftsRequest {
  shifts: CreateShiftRequest[];
}

export interface ClockInRequest {
  notes?: string;
  location?: string;
  device?: string;
}

export interface ClockOutRequest {
  notes?: string;
  location?: string;
  device?: string;
}

export interface RecordBreakRequest {
  eventType: AttendanceEventType.BreakStart | AttendanceEventType.BreakEnd;
  notes?: string;
}

export interface UpdateShiftPerformanceRequest {
  totalSales: number;
  ordersProcessed: number;
}

export interface ShiftListResponse {
  items: Shift[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const shiftService = {
  /**
   * Get all shifts with optional filtering
   */
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    employeeProfileId?: string;
    storeId?: string;
    status?: ShiftStatus;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get<ShiftListResponse>('/api/shifts', { params }),

  /**
   * Get shift by ID
   */
  getById: (id: string) =>
    apiClient.get<Shift>(`/api/shifts/${id}`),

  /**
   * Get shifts by employee ID
   */
  getByEmployee: (employeeId: string, params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get<ShiftListResponse>(`/api/shifts/employee/${employeeId}`, { params }),

  /**
   * Get shifts by date range
   */
  getByDateRange: (params: {
    startDate: string;
    endDate: string;
    employeeProfileId?: string;
    storeId?: string;
  }) => apiClient.get<Shift[]>('/api/shifts/date-range', { params }),

  /**
   * Get active (in-progress) shifts
   */
  getActive: (params?: {
    storeId?: string;
  }) => apiClient.get<Shift[]>('/api/shifts/active', { params }),

  /**
   * Get upcoming shifts for employee
   */
  getUpcoming: (employeeId: string, params?: {
    days?: number;
  }) => apiClient.get<Shift[]>(`/api/shifts/upcoming/${employeeId}`, { params }),

  /**
   * Create new shift
   */
  create: (data: CreateShiftRequest) =>
    apiClient.post<Shift>('/api/shifts', data),

  /**
   * Create multiple shifts (bulk scheduling)
   */
  createBulk: (data: BulkCreateShiftsRequest) =>
    apiClient.post<Shift[]>('/api/shifts/bulk', data),

  /**
   * Update shift schedule
   */
  update: (id: string, data: UpdateShiftRequest) =>
    apiClient.put<Shift>(`/api/shifts/${id}`, data),

  /**
   * Clock in to shift
   */
  clockIn: (id: string, data?: ClockInRequest) =>
    apiClient.post<Shift>(`/api/shifts/${id}/clock-in`, data),

  /**
   * Clock out from shift
   */
  clockOut: (id: string, data?: ClockOutRequest) =>
    apiClient.post<Shift>(`/api/shifts/${id}/clock-out`, data),

  /**
   * Record break start/end
   */
  recordBreak: (id: string, data: RecordBreakRequest) =>
    apiClient.post<Shift>(`/api/shifts/${id}/break`, data),

  /**
   * Cancel shift
   */
  cancel: (id: string, reason?: string) =>
    apiClient.post<Shift>(`/api/shifts/${id}/cancel`, { reason }),

  /**
   * Mark shift as no-show
   */
  markNoShow: (id: string, notes?: string) =>
    apiClient.post<Shift>(`/api/shifts/${id}/no-show`, { notes }),

  /**
   * Update shift performance metrics
   */
  updatePerformance: (id: string, data: UpdateShiftPerformanceRequest) =>
    apiClient.put<Shift>(`/api/shifts/${id}/performance`, data),

  /**
   * Get shift attendance events
   */
  getAttendance: (id: string) =>
    apiClient.get<ShiftAttendance[]>(`/api/shifts/${id}/attendance`),

  /**
   * Delete shift
   */
  delete: (id: string) =>
    apiClient.delete(`/api/shifts/${id}`)
};

export default shiftService;
