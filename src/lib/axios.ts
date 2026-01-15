import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authEventEmitter } from "./auth-event-emitter";
import { refreshAccessToken } from "./refresh-token-client";
import { tokenStorage } from "./token-storage";

export type BaseApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: Date;
};

const axiosInstanceapi = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL, // Your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if a refresh is in progress to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
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

// Add interceptors here for error handling, authentication tokens, etc.
axiosInstanceapi.interceptors.request.use(
  async (config) => {
    // Only add Authorization header if requiresAuth flag is true
    if (config.requiresAuth) {
      const token = await tokenStorage.getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceapi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("Axios response error interceptor triggered:", error);
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstanceapi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();

        if (!refreshToken) {
          // No refresh token, clear everything and emit logout event
          await tokenStorage.clearTokens();
          authEventEmitter.emit("logout", {
            reason: "No refresh token available",
          });
          return Promise.reject(error);
        }

        const response = await refreshAccessToken(refreshToken);

        if (response.success && response.data?.accessToken) {
          const { accessToken } = response.data;

          // Update stored access token
          await tokenStorage.setToken(accessToken);

          // If backend also returns a new refresh token, update it
          if (response.data.refreshToken) {
            await tokenStorage.setRefreshToken(response.data.refreshToken);
          }

          // Update the original request header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Process queued requests
          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry the original request
          return axiosInstanceapi(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and emit event
        processQueue(refreshError, null);
        await tokenStorage.clearTokens();
        isRefreshing = false;

        // Emit token refresh failed event
        authEventEmitter.emit("token-refresh-failed", {
          reason: "Token refresh failed",
          error: refreshError instanceof Error ? refreshError : new Error("Unknown error"),
        });

        return Promise.reject(refreshError);
      }
    }

    // For other 401 errors (not handled by refresh, e.g., no requiresAuth flag)
    if ([401].includes(error.response?.status || 0)) {
      authEventEmitter.emit("unauthorized", {
        reason: "Unauthorized access",
        error: error instanceof Error ? error : new Error("Unauthorized"),
      });
    }

    // For other errors, just log and reject
    console.log("Error in axios interceptors: ", error);
    return Promise.reject(error);
  }
);

export default axiosInstanceapi;
