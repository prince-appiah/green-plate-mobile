import { BaseUser, User } from "@/features/shared";
import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";
import { GoogleSigninResponse } from "./auth-types";

class AuthService {
  private static instance: AuthService;
  private readonly endpoints = { base: "/auth" } as const;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async googleSignin(token: string) {
    const fn = await axiosInstanceapi.post(`${this.endpoints.base}/google`, {
      token,
    });
    const response = await handleAsync<BaseApiResponse<GoogleSigninResponse>>(fn.data);
    return response;
  }

  async getUserInfo() {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/me`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<BaseUser>>(fn.data);
    return response;
  }

  async refreshToken(refreshToken: string) {
    const fn = await axiosInstanceapi.post(`${this.endpoints.base}/refresh`, {
      refreshToken,
    });
    const response = await handleAsync<
      BaseApiResponse<{
        accessToken: string;
        refreshToken?: string; // Optional if backend rotates refresh tokens
      }>
    >(fn.data);
    return response;
  }

  async logout() {
    const fn = await axiosInstanceapi.post(`${this.endpoints.base}/logout`);
    const response = await handleAsync<BaseApiResponse<User>>(fn.data);
    return response;
  }
}
export const authService = new AuthService();
