import { listingsService } from "../services/listings.service";
import { useQuery, UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listingsQueryKeys } from "./listings-query-keys";
import { GetPublicListingsQuery } from "../services/listings-types";

const getPublicListingsQueryOptions = (query?: GetPublicListingsQuery & Partial<UseQueryOptions>) => ({
  queryKey: listingsQueryKeys.publicListings(query),
  queryFn: () => listingsService.getPublicListings(query || {}),
});

const getPublicListingByIdQueryOptions = (id: string & Partial<UseQueryOptions>) => ({
  queryKey: listingsQueryKeys.publicListingById(id),
  queryFn: () => listingsService.getPublicListingById(id),
});

export const useGetPublicListingsSuspense = (query?: GetPublicListingsQuery) => {
  return useSuspenseQuery(getPublicListingsQueryOptions(query));
};

export const useGetPublicListings = (query?: GetPublicListingsQuery) => {
  return useQuery(getPublicListingsQueryOptions(query));
};

export const useGetPublicListingById = (id: string) => {
  return useQuery({
    ...getPublicListingByIdQueryOptions(id),
    enabled: !!id,
  });
};

export const useGetPublicListingByIdSuspense = (id: string) => {
  return useSuspenseQuery({
    ...getPublicListingByIdQueryOptions(id),
  });
};
