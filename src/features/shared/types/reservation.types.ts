import { Listing } from "./listing.types";
import { Consumer, Restaurant } from "./user.types";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "ready_for_pickup"
  | "picked_up"
  | "cancelled"
  | "completed"
  | "expired";

export interface Reservation {
  id: string;
  listingId: string;
  restaurantId: string;
  consumerId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  totalPrice: number;
  status: ReservationStatus;
  payment: {
    provider: "stripe";
    paymentIntentId: string;
    paidAt: Date;
  };
  pickup: {
    code: string;
    verifiedAt: Date;
    verifiedByRestaurantUserId: string;
  };
  restaurant: Restaurant;
  impactSnapshot: {
    mealsSaved: number;
    co2PreventedKg: number;
  };
  consumer: Pick<Consumer, "id" | "name" | "email" | "phone" | "avatarUrl">;
  listing: Pick<Listing, "id" | "title" | "category" | "photoUrls">;
  createdAt: Date;
  updatedAt: Date;
}
