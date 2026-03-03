import { ReservationStatus } from "@/features/shared";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateReservationPayload,
  GetReservationsQuery,
  UpdateReservationStatusPayload,
} from "../services/reservations-types";
import { reservationsService } from "../services/reservations.service";
import { reservationsQueryKeys } from "./reservations-query-keys";

const getReservationsQueryOptions = (query?: GetReservationsQuery) => ({
  queryKey: reservationsQueryKeys.getCustomerReservations(query),
  queryFn: () => reservationsService.getCustomerReservations(query),
});

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => reservationsService.createReservation(payload),
    onSuccess: () => {
      // Invalidate reservations list to refetch
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.getCustomerReservations(),
      });
      // Also invalidate listings to update available quantity
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.getCustomerReservations(),
      });
    },
  });
}

export function useGetMyReservations(query?: GetReservationsQuery) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    ...getReservationsQueryOptions(query),
    enabled: !!userId,
    refetchInterval: 60000 * 3,
  });
}

export function useGetReservationById(id: string) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: reservationsQueryKeys.getCustomerReservationById(id),
    queryFn: () => reservationsService.getReservationById(id),
    enabled: !!id && !!userId,
    // retryDelay: 10000, // 10 seconds
    refetchInterval: ({ state }) => {
      const reservationStatuses: ReservationStatus[] = ["ready_for_pickup", "picked_up", "confirmed"];

      if (reservationStatuses.includes(state.data?.data.status!)) {
        return 10000;
      }
      return false;
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateReservationStatusPayload) => reservationsService.updateReservationStatus(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.getCustomerReservations(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.getCustomerReservationById(variables.reservationId),
      });
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });
    },
  });
}
