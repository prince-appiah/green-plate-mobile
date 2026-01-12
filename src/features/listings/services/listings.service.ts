import { Listing } from "@/features/shared";
import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";
import { buildQueryParams } from "@/lib/utils";
import {
  CreateListingPayload,
  GetOwnListingsQuery,
  GetPublicListingByIdResponse,
  GetPublicListingsQuery,
  GetPublicListingsResponse,
  UpdateListingPayload,
} from "./listings-types";

class ListingsService {
  private static instance: ListingsService;
  private readonly endpoints = { base: "/listings" } as const;

  public static getInstance(): ListingsService {
    if (!ListingsService.instance) {
      ListingsService.instance = new ListingsService();
    }
    return ListingsService.instance;
  }

  async createListing(payload: CreateListingPayload) {
    const fn = await axiosInstanceapi.post(this.endpoints.base, payload, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Listing>>(fn.data);
    return response;
  }

  async getOwnListings(query: GetOwnListingsQuery) {
    const queryString = buildQueryParams(query);
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}?${queryString ? queryString.toString() : ""}`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Listing[]>>(fn.data);
    return response;
  }

  async getListingById(id: string) {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/${id}`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Listing>>(fn.data);
    return response;
  }

  async updateListing({ listingId, ...payload }: UpdateListingPayload) {
    const fn = await axiosInstanceapi.patch(`${this.endpoints.base}/${listingId}`, payload, { requiresAuth: true });
    const response = await handleAsync<BaseApiResponse<Listing>>(fn.data);
    return response;
  }

  async deleteListing(id: string) {
    const fn = await axiosInstanceapi.delete(`${this.endpoints.base}/${id}`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Listing>>(fn.data);
    return response;
  }

  // CONSUMER ENDPOINTS
  async getPublicListings(query: GetPublicListingsQuery) {
    const queryString = buildQueryParams(query);
    const fn = await axiosInstanceapi.get(
      `${this.endpoints.base}/public?${queryString ? queryString.toString() : ""}`,
      { requiresAuth: true }
    );
    const response = await handleAsync<BaseApiResponse<GetPublicListingsResponse[]>>(fn.data);
    return response;
  }

  async getPublicListingById(id: string) {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/public/${id}`, { requiresAuth: true });
    const response = await handleAsync<BaseApiResponse<GetPublicListingByIdResponse>>(fn.data);
    return response;
  }
}

export const listingsService = new ListingsService();
