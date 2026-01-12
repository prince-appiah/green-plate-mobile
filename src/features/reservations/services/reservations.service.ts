import { Reservation } from "@/features/shared";
import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";
import { buildQueryParams } from "@/lib/utils";
import {
  CancelReservationPayload,
  CancelReservationResponse,
  CreateReservationPayload,
  CreateReservationResponse,
  GetReservationsQuery,
  GetReservationsResponse,
  GetRestaurantReservationsQuery,
  GetRestaurantReservationsResponse,
  UpdateMyReservationStatusPayload,
  UpdateReservationStatusPayload,
  UpdateReservationStatusResponse,
  VerifyReservationPickupByCodePayload,
  VerifyReservationPickupByCodeResponse,
} from "./reservations-types";

class ReservationsService {
  private static instance: ReservationsService;
  private readonly endpoints = { base: "/reservations" } as const;

  public static getInstance(): ReservationsService {
    if (!ReservationsService.instance) {
      ReservationsService.instance = new ReservationsService();
    }
    return ReservationsService.instance;
  }

  async createReservation(payload: CreateReservationPayload) {
    const fn = await axiosInstanceapi.post(this.endpoints.base, payload, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<CreateReservationResponse>>(fn.data);
    return response;
  }

  async getCustomerReservations(query?: GetReservationsQuery) {
    const queryString = buildQueryParams(query || {});
    const queryStr = queryString.toString();
    const url = queryStr ? `${this.endpoints.base}?${queryStr}` : this.endpoints.base;

    const fn = await axiosInstanceapi.get(url, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<GetReservationsResponse[]>>(fn.data);
    return response;
  }

  async getReservationById(id: string) {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/${id}`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Reservation>>(fn.data);
    return response;
  }

  // async cancelReservation({ reservationId }: CancelReservationPayload) {
  //   const fn = await axiosInstanceapi.patch(
  //     `${this.endpoints.base}/${reservationId}/cancel`,
  //     {},
  //     { requiresAuth: true }
  //   );
  //   const response = await handleAsync<BaseApiResponse<CancelReservationResponse>>(fn.data);
  //   return response;
  // }

  async updateMyReservationStatus({ reservationId, status }: UpdateMyReservationStatusPayload) {
    const fn = await axiosInstanceapi.patch(
      `${this.endpoints.base}/${reservationId}/status`,
      { status },
      { requiresAuth: true }
    );
    const response = await handleAsync<BaseApiResponse<CancelReservationResponse>>(fn.data);
    return response;
  }

  async getRestaurantReservations(query?: GetRestaurantReservationsQuery) {
    const queryString = buildQueryParams(query || {});
    const queryStr = queryString.toString();
    const url = queryStr
      ? `${this.endpoints.base}/restaurant?${queryStr}`
      : `${this.endpoints.base}/restaurant`;

    const fn = await axiosInstanceapi.get(url, { requiresAuth: true });
    const response = await handleAsync<BaseApiResponse<GetRestaurantReservationsResponse[]>>(fn.data);
    return response;
  }

  async getRestaurantReservationById(id: string) {
    const fn = await axiosInstanceapi.get(`${this.endpoints.base}/restaurant/${id}`, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<Reservation>>(fn.data);
    return response;
  }

  async verifyReservationPickupByCode(payload: VerifyReservationPickupByCodePayload) {
    const fn = await axiosInstanceapi.post(`${this.endpoints.base}/restaurant/verify-pickup`, payload, {
      requiresAuth: true,
    });
    const response = await handleAsync<BaseApiResponse<VerifyReservationPickupByCodeResponse>>(fn.data);
    return response;
  }

  async updateReservationStatus({ reservationId, status }: UpdateReservationStatusPayload) {
    const fn = await axiosInstanceapi.patch(
      `${this.endpoints.base}/restaurant/${reservationId}/status`,
      { status },
      { requiresAuth: true }
    );
    const response = await handleAsync<BaseApiResponse<UpdateReservationStatusResponse>>(fn.data);
    return response;
  }
}

export const reservationsService = new ReservationsService();
