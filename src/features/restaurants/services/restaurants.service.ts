import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";
import {
  GetRestaurantByIdResponse,
  GetRestaurantProfileResponse,
  GetRestaurantStatsResponse,
  UpdateRestaurantProfilePayload,
  UpdateRestaurantProfileResponse,
  UpdateRestaurantSettingsPayload,
  UpdateRestaurantSettingsResponse,
} from "./restaurants-types";

class RestaurantsService {
  private static instance: RestaurantsService;
  private readonly endpoints = { base: "/restaurants" } as const;

  public static getInstance(): RestaurantsService {
    if (!RestaurantsService.instance) {
      RestaurantsService.instance = new RestaurantsService();
    }
    return RestaurantsService.instance;
  }

  async getMyRestaurantProfile() {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/me`, {
      requiresAuth: true,
    });
    const response = await handleAsync<
      BaseApiResponse<GetRestaurantProfileResponse>
    >(fn.data);
    return response;
  }

  async updateProfile(payload: UpdateRestaurantProfilePayload) {
    const fn = await axiosInstanceapi.patch(
      `${this.endpoints.base}/me`,
      payload,
      {
        requiresAuth: true,
      }
    );
    const response = await handleAsync<
      BaseApiResponse<UpdateRestaurantProfileResponse>
    >(fn.data);
    return response;
  }

  async getMyRestaurantStats() {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/me/stats`, {
      requiresAuth: true,
    });
    const response = await handleAsync<
      BaseApiResponse<GetRestaurantStatsResponse>
    >(fn.data);
    return response;
  }

  async updateSettings(payload: UpdateRestaurantSettingsPayload) {
    const fn = await axiosInstanceapi.patch(
      `${this.endpoints.base}/me/settings`,
      payload,
      {
        requiresAuth: true,
      }
    );
    const response = await handleAsync<
      BaseApiResponse<UpdateRestaurantSettingsResponse>
    >(fn.data);
    return response;
  }

  async getRestaurantById(restaurantId: string) {
    const fn = await axiosInstanceapi.get(
      `${this.endpoints.base}/${restaurantId}`,
      {
        requiresAuth: false, // Public endpoint for consumers
      }
    );
    const response = await handleAsync<
      BaseApiResponse<GetRestaurantByIdResponse>
    >(fn.data);
    return response;
  }
}

export const restaurantsService = new RestaurantsService();
