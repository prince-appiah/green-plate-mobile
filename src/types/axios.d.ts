import "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
  }
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}
