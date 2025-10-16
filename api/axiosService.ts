import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, apiEndpoints } from '../constants/config';
import { store } from '../store';
import { updateTokens, logout } from '../store/authSlice';

export interface ApiError {
  message: string;
  status?: number;
}

// Create axios instance
const axiosService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add auth token
axiosService.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosService.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors (expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosService(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = store.getState().auth.refreshToken;

      if (!refreshToken) {
        // No refresh token available, logout user
        store.dispatch(logout());
        isRefreshing = false;
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}${apiEndpoints.REFRESH}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in store and storage
        await store.dispatch(
          updateTokens({
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry the original request
        return axiosService(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

export default axiosService;
