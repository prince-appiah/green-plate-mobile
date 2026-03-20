import type { BaseUser } from "@/features/shared";
import type { BaseApiResponse } from "@/lib/axios";
import axiosInstanceapi from "@/lib/axios";
import { tokenStorage } from "@/lib/token-storage";
import { mapSessionUserToBaseUser } from "../utils/session-mapper";

const AUTH_ME_PATH = "/auth/me";

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getSession(): Promise<BaseApiResponse<BaseUser | null>> {
    const token = await tokenStorage.getToken();
    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
        data: null,
        timestamp: new Date(),
      };
    }

    try {
      const { data: apiResponse } = await axiosInstanceapi.get<BaseApiResponse<unknown>>(AUTH_ME_PATH, {
        requiresAuth: true,
      });
      const raw = apiResponse?.data as Record<string, unknown> | null | undefined;
      const user = mapSessionUserToBaseUser(raw ? { ...raw, id: raw.id as string, userId: raw.id as string } : null);
      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: null,
          timestamp: new Date(),
        };
      }
      return {
        success: true,
        message: "Success",
        data: user,
        timestamp: new Date(),
      };
    } catch {
      return {
        success: false,
        message: "Failed to get session",
        data: null,
        timestamp: new Date(),
      };
    }
  }
}

export const authService = AuthService.getInstance();
