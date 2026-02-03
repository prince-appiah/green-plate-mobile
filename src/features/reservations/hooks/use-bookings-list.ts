import { ReservationStatus } from "@/features/shared";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useGetMyReservations } from "./use-reservations";

export const STATUS_FILTER_OPTIONS: Array<{
  label: string;
  value: ReservationStatus | "all";
}> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

/**
 * Custom hook for managing bookings list state and filtering
 * Handles status filtering, navigation, and data fetching
 */
export const useBookingsList = () => {
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | "all">("all");

  const { data: reservationsResponse, isPending, error, refetch } = useGetMyReservations();

  const allReservations = reservationsResponse?.data || [];

  // Filter reservations based on selected status
  const filteredReservations = useMemo(() => {
    if (selectedStatus === "all") {
      return allReservations;
    }
    return allReservations.filter((r) => r.status === selectedStatus);
  }, [allReservations, selectedStatus]);

  // Navigate to reservation details
  const handleReservationPress = useCallback((reservationId: string) => {
    router.push(`/(consumers)/bookings/${reservationId}`);
  }, []);

  // Navigate to discover listings
  const handleBrowseListings = useCallback(() => {
    router.push("/(consumers)/");
  }, []);

  return {
    // Data
    allReservations,
    filteredReservations,

    // State
    selectedStatus,
    setSelectedStatus,
    isPending,
    error,

    // Actions
    refetch,
    handleReservationPress,
    handleBrowseListings,

    // Constants
    statusFilterOptions: STATUS_FILTER_OPTIONS,
  };
};
