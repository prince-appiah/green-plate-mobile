import { useLocalSearchParams } from "expo-router";
import { useGetPublicListingByIdSuspense } from "./use-public-listings";

/**
 * Custom hook for managing listing details screen logic
 * Handles data fetching, transformations, and error states
 */
export function useListingDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: listingResponse, refetch, isPending } = useGetPublicListingByIdSuspense(id);

  const listing = listingResponse?.data;

  return {
    id,
    listing,
    refetch,
    isPending,
    isLoading: !listing,
  };
}
