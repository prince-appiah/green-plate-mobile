import {
  GetOwnListingsQuery,
  GetPublicListingsQuery,
} from "../services/listings-types";

export const listingsQueryKeys = {
  all: ["listings"] as const,
  ownListings: (query?: GetOwnListingsQuery) =>
    [...listingsQueryKeys.all, "ownListings", query] as const,
  detail: (id: string) => [...listingsQueryKeys.all, "detail", id] as const,

  publicListings: (query?: GetPublicListingsQuery) =>
    [...listingsQueryKeys.all, "publicListings", query] as const,
  publicListingById: (id: string) =>
    [...listingsQueryKeys.all, "publicListingById", id] as const,
};
