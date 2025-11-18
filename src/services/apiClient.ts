import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from 'axios';
import config from '../config';

// Types for queue management
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

// Create axios instance with credentials enabled for httpOnly cookies
const apiClient: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

// Request interceptor - no need to add auth token manually
// Cookies are sent automatically with withCredentials: true
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is sent automatically via httpOnly cookie
    // No manual Authorization header needed
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: Error & { config?: AxiosRequestConfig; response?: AxiosResponse }) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('========================================');
      console.log('API CLIENT - 401 UNAUTHORIZED ERROR');
      console.log('========================================');
      console.log('Request URL:', originalRequest.url);

      // Skip refresh for login and refresh endpoints
      if (originalRequest.url?.includes('/api/auth/login') ||
          originalRequest.url?.includes('/api/auth/refresh')) {
        console.log('Login or refresh endpoint failed, not retrying');
        console.log('========================================');
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log('Already refreshing token, queuing request...');
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry original request with new cookie
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      // Try to refresh the token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh token via cookie...');
        // Backend will read refreshToken from httpOnly cookie
        const response = await axios.post<RefreshTokenResponse>(
          `${config.API_BASE_URL}/api/auth/refresh`,
          {}, // No body needed, backend reads cookie
          { withCredentials: true } // Send cookies
        );

        console.log('✅ Token refresh successful - new cookies set by backend');

        // Process the queue - no token needed, cookies are automatic
        processQueue(null, '');

        // Retry the original request (with new cookies)
        console.log('Retrying original request with new cookies');
        console.log('========================================');
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);

        console.log('Session expired, dispatching logout');

        // Dispatch logout action
        interface WindowWithStore extends Window {
          store?: {
            dispatch: (action: { type: string }) => void;
          };
        }
        const windowWithStore = window as WindowWithStore;
        if (windowWithStore.store) {
          windowWithStore.store.dispatch({ type: 'auth/resetAuth' });
        }

        // Redirect to login
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login');
          window.location.href = '/login';
        }

        console.log('========================================');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Not a 401 error, just return the error
    return Promise.reject(error);
  }
);

export default apiClient;
