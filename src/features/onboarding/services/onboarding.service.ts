import { IUserRole } from "@/features/shared";
import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";

import {
  OnboardingStatusResponse,
  RestaurantOnboardingPayload,
  RestaurantOnboardingResponse,
  SubmitCustomerBasicInfoPayload,
  SubmitCustomerBasicInfoResponse,
  SubmitCustomerPreferencesPayload,
  SubmitCustomerPreferencesResponse,
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
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/role`,
      { role },
      { requiresAuth: true }
    );
    const response = await handleAsync<BaseApiResponse<{ role: IUserRole }>>(
      fn.data
    );
    return response;
  }

  async completeRestaurantOnboarding(payload: RestaurantOnboardingPayload) {
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/restaurant`,
      payload,
      { requiresAuth: true }
    );
    const response = await handleAsync<
      BaseApiResponse<RestaurantOnboardingResponse>
    >(fn.data);
    return response;
  }

  async submitCustomerBasicInfo(payload: SubmitCustomerBasicInfoPayload) {
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/customer/basic-info`,
      payload,
      { requiresAuth: true }
    );
    const response = await handleAsync<
      BaseApiResponse<SubmitCustomerBasicInfoResponse>
    >(fn.data);
    return response;
  }

  async submitCustomerPreferences(payload: SubmitCustomerPreferencesPayload) {
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}/customer/preferences`,
      payload,
      { requiresAuth: true }
    );
    const response = await handleAsync<
      BaseApiResponse<SubmitCustomerPreferencesResponse>
    >(fn.data);
    return response;
  }
}

export const onboardingService = new OnboardingService();
