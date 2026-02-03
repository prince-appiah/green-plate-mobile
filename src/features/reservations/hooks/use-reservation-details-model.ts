import { useGetPublicListingById } from "@/features/listings/hooks/use-public-listings";
import { formatTimeRange } from "@/features/shared";
import { router } from "expo-router";
import { Alert } from "react-native";
import { getReservationStatusConfig } from "../helpers";
import { useGetReservationById } from "./use-reservations";
import { useUpdateMyReservationStatus } from "./use-restaurant-reservations";

/**
 * Custom hook for managing reservation details screen logic
 * Handles data fetching, status management, and cancellation logic
 */
export const useReservationDetailsModel = (reservationId: string) => {
  // Fetch reservation data
  const {
    data: reservationResponse,
    isPending: isLoadingReservation,
    refetch: refetchReservation,
  } = useGetReservationById(reservationId);
  const reservation = reservationResponse?.data;

  // Fetch associated listing data
  const {
    data: listingResponse,
    isPending: isLoadingListing,
    refetch: refetchListing,
  } = useGetPublicListingById(reservation?.listingId!);
  const listing = listingResponse?.data;

  // Mutation for updating reservation status
  const { mutate: updateMyReservationStatus, isPending: isCancelling } = useUpdateMyReservationStatus();

  // Computed values
  const isLoading = isLoadingReservation || isLoadingListing;
  const statusInfo = reservation ? getReservationStatusConfig(reservation.status) : null;
  const imageUrl = listing?.photoUrls?.[0] || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const timeRange = listing ? formatTimeRange(listing.pickup.startTime, listing.pickup.endTime) : "N/A";
  const canCancel = reservation?.status === "pending";

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([refetchReservation(), refetchListing()]);
  };

  // Handle reservation cancellation
  const handleCancel = () => {
    if (!reservation) return;

    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            updateMyReservationStatus(
              {
                reservationId: reservation.id,
                status: "cancelled",
              },
              {
                onSuccess: () => {
                  Alert.alert("Reservation Cancelled", "Your reservation has been cancelled successfully.", [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]);
                },
                onError: (error: any) => {
                  Alert.alert(
                    "Cancellation Failed",
                    error?.response?.data?.message ||
                      error?.message ||
                      "Failed to cancel reservation. Please try again.",
                  );
                },
              },
            );
          },
        },
      ],
    );
  };

  return {
    // Data
    reservation,
    listing,
    statusInfo,
    imageUrl,
    timeRange,

    // States
    isLoading,
    isCancelling,
    canCancel,

    // Actions
    handleRefresh,
    handleCancel,
  };
};
