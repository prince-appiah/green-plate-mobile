import { IUserRole } from "@/features/shared";
import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { AUTH_STORAGE_TOKEN_KEY } from "@/lib/token-storage";
import { handleAsync } from "@/lib/try-catch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CustomerOnboardingPayload,
  CustomerOnboardingResponse,
  OnboardingStatusResponse,
  RestaurantOnboardingPayload,
  RestaurantOnboardingResponse,
} from "./onboarding-types";

class OnboardingService {
  private static instance: OnboardingService;
  private readonly endpoints = {
    base: "/onboarding",
  };

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  async getOnboardingStatus() {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/status`, {
      requiresAuth: true,
    });
    const response = await handleAsync<
      BaseApiResponse<OnboardingStatusResponse>
    >(fn.data);
    return response;
  }

  async selectOnboardingRole(role: IUserRole) {
    // const token = await AsyncStorage.getItem(AUTH_STORAGE_TOKEN_KEY);
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/role`,
      { role },
      { requiresAuth: true },
    );
    const response = await handleAsync<BaseApiResponse<{ role: IUserRole }>>(
      fn.data,
    );
    return response;
  }

  async completeRestaurantOnboarding(payload: RestaurantOnboardingPayload) {
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/restaurant`,
      payload,
      { requiresAuth: true },
    );
    const response = await handleAsync<
      BaseApiResponse<RestaurantOnboardingResponse>
    >(fn.data);
    return response;
  }

  async completeCustomerOnboarding(payload: CustomerOnboardingPayload) {
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/customer`,
      payload,
      { requiresAuth: true },
    );
    const response = await handleAsync<
      BaseApiResponse<CustomerOnboardingResponse>
    >(fn.data);
    return response;
  }
}

export const onboardingService = new OnboardingService();
