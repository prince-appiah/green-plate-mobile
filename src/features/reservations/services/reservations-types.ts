import { Reservation, ReservationStatus, Restaurant } from "@/features/shared";
import { QueryObject } from "@/lib/utils";

export interface CreateReservationPayload {
  listingId: string;
  quantity: number;
}

export interface CreateReservationResponse extends Reservation { }

export interface GetReservationsQuery extends QueryObject {
  status?: ReservationStatus;
  listingId?: string;
  page?: number;
  limit?: number;
}

export interface GetReservationsResponse extends Reservation { }

export interface CancelReservationPayload {
  reservationId: string;
}

export interface CancelReservationResponse extends Reservation { }

export interface GetRestaurantReservationsQuery extends QueryObject {
  status?: ReservationStatus;
  listingId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface GetRestaurantReservationsResponse extends Reservation { }

export interface VerifyReservationPickupByCodePayload {
  reservationId: string;
  code: string;
}

export interface VerifyReservationPickupByCodeResponse extends Reservation { }

export interface UpdateReservationStatusPayload {
  reservationId: string;
  status: ReservationStatus;
}

export interface UpdateMyReservationStatusPayload {
  reservationId: string;
  status: ReservationStatus;
}

export interface UpdateReservationStatusResponse extends Reservation { }
