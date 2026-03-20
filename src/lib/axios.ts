import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authEventEmitter } from "./auth-event-emitter";
import { tokenStorage } from "./token-storage";

export type BaseApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: Date;
};

const axiosInstanceapi = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceapi.interceptors.request.use(
  async (config) => {
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
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401) {
      authEventEmitter.emit("unauthorized", {
        reason: "Unauthorized access",
        error: error instanceof Error ? error : new Error("Unauthorized"),
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstanceapi;
