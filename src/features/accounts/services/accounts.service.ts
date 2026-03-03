import { Restaurant } from "@/features/shared";
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
    const response = await handleAsync<BaseApiResponse<GetProfileResponse>>(fn.data);
    return response;
  }

  async deactivateAccount(accountId: string) {
    const fn = await axiosInstanceapi.delete(`${this.endpoints.base}/${accountId}`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Restaurant>>(fn.data);
    return response;
  }

  async deleteAccount(confirmPermanentDeletion: boolean) {
    const fn = await axiosInstanceapi.post(
      `${this.endpoints.base}me/delete-permanent`,
      { confirmPermanentDeletion },
      {
        requiresAuth: true,
      },
    );
    const response = await handleAsync<BaseApiResponse<null>>(fn.data);
    return response;
  }
}

export const accountsService = new AccountsService();
