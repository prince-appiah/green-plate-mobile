import { Restaurant } from "@/features/shared";

export interface GetRestaurantProfileResponse extends Restaurant {}

export interface UpdateRestaurantProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  restaurantName?: string;
  cuisineType?: string;
  operatingHours?: string;
}

export interface UpdateRestaurantProfileResponse extends Restaurant {}

export interface GetRestaurantStatsResponse {
  totalRevenue: number;
  totalListings: number;
  totalReservations: number;
  totalMealsSaved: number;
  totalCo2PreventedKg: number;
}

export interface RestaurantSettings {
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  autoConfirmOrders?: boolean;
  defaultPickupTime?: string;
  [key: string]: unknown;
}

export interface UpdateRestaurantSettingsPayload {
  settings: RestaurantSettings;
}

export interface UpdateRestaurantSettingsResponse {
  settings: RestaurantSettings;
}

export interface GetRestaurantByIdResponse {
  id: string;
  name: string;
  restaurantName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  description?: string;
  cuisineType?: string;
  operatingHours?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: [number, number];
  };
  rating?: number;
  totalReviews?: number;
}
