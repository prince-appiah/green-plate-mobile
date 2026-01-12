import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";
import { GetProfileResponse } from "./accounts-types";

class AccountsService {
  private static instance: AccountsService;
  private readonly endpoints = { base: "/accounts" } as const;

  public static getInstance(): AccountsService {
    if (!AccountsService.instance) {
      AccountsService.instance = new AccountsService();
    }
    return AccountsService.instance;
  }

  async getProfile() {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/me/profile`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<GetProfileResponse>>(
      fn.data
    );
    return response;
  }
}

export const accountsService = new AccountsService();
