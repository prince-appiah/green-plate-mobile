import { transformError } from "@/lib/try-catch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  CreateListingPayload,
  GetOwnListingsQuery,
  UpdateListingPayload,
} from "../services/listings-types";
import { listingsService } from "../services/listings.service";
import { listingsQueryKeys } from "./listings-query-keys";

export const useGetOwnListings = (query?: GetOwnListingsQuery) => {
  return useQuery({
    queryKey: listingsQueryKeys.ownListings(query),
    queryFn: () => listingsService.getOwnListings(query || {}),
  });
};

export const useGetListingById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: listingsQueryKeys.detail(id),
    queryFn: () => listingsService.getListingById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-listing"],
    mutationFn: (payload: CreateListingPayload) =>
      listingsService.createListing(payload),
    onSuccess: () => {
      // Invalidate own listings to refetch with the new listing
      queryClient.invalidateQueries({
        queryKey: listingsQueryKeys.ownListings(),
      });
    },
    onError: (error) => {
      console.error("Error creating listing:", transformError(error));
      Alert.alert("Error", transformError(error));
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateListingPayload) =>
      listingsService.updateListing(payload),
    onSuccess: (data, variables) => {
      // Invalidate the specific listing detail
      queryClient.invalidateQueries({
        queryKey: listingsQueryKeys.detail(variables.listingId),
      });
      // Invalidate own listings to refetch updated list
      queryClient.invalidateQueries({
        queryKey: listingsQueryKeys.ownListings(),
      });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingsService.deleteListing(id),
    onSuccess: (data, deletedId) => {
      // Remove the deleted listing from cache
      queryClient.removeQueries({
        queryKey: listingsQueryKeys.detail(deletedId),
      });
      // Invalidate own listings to refetch without the deleted listing
      queryClient.invalidateQueries({
        queryKey: listingsQueryKeys.ownListings(),
      });
    },
  });
};
