import { IRestaurant, Listing, ListingCategory, ListingStatus } from "@/features/shared";
import { QueryObject } from "@/lib/utils";

export interface CreateListingPayload {
  title: string;
  description: string;
  category: ListingCategory;
  photoUrls: string[];
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  quantityTotal: number;
  maxPerUser: number;
  pickup: {
    startTime: Date;
    endTime: Date;
    location: {
      coordinates: [number, number];
    };
    instructions: string;
  };
  isVisible: boolean;
}

export interface CreateListingResponse {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  photoUrls: string[];
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  quantityTotal: number;
  maxPerUser: number;
}

export interface GetOwnListingsQuery extends QueryObject {
  category?: string;
  status?: ListingStatus;
}

export interface UpdateListingPayload extends Omit<CreateListingPayload, "photoUrls" | "id"> {
  listingId: string;
}

export interface GetPublicListingsQuery extends QueryObject {
  search?: string;
  category?: ListingCategory;
  radiusKm?: number;
  longitude?: number;
  latitude?: number;
}

export interface GetPublicListingsResponse extends Listing {
  restaurant: IRestaurant;
}

export interface GetPublicListingByIdResponse extends Listing {
  restaurant: IRestaurant;
}
