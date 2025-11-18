import { AxiosError } from 'axios';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * API error interface matching backend error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  errors?: Record<string, string[]>;
}

/**
 * Generic API state using discriminated union pattern
 * Provides type-safe state management for async operations
 */
export type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

/**
 * Type guard to check if an error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError<ApiError> {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Extract error message from any error type
 * Handles Axios errors, standard errors, and unknown errors
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Extract validation errors from API error response
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isAxiosError(error)) {
    return error.response?.data?.errors ?? null;
  }
  return null;
}
