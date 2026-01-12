import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "../services/reservations.service";
import { reservationsQueryKeys } from "./reservations-query-keys";
import {
  CancelReservationPayload,
  GetRestaurantReservationsQuery,
  UpdateMyReservationStatusPayload,
  UpdateReservationStatusPayload,
  VerifyReservationPickupByCodePayload,
} from "../services/reservations-types";
import { useAuthStore } from "@/stores/auth-store";
import { ReservationStatus } from "@/features/shared";

const getRestaurantReservationsQueryOptions = (filters?: GetRestaurantReservationsQuery) => ({
  queryKey: reservationsQueryKeys.getRestaurantReservations(filters),
  queryFn: () => reservationsService.getRestaurantReservations(filters),
  refetchInterval: 60000 * 3,
});

const getRestaurantReservationByIdQueryOptions = (id: string) => ({
  queryKey: reservationsQueryKeys.restaurantListById(id),
  queryFn: () => reservationsService.getRestaurantReservationById(id),
});

export const useGetRestaurantReservations = (filters?: GetRestaurantReservationsQuery) => {
  return useQuery(getRestaurantReservationsQueryOptions(filters));
};

export const useGetRestaurantReservationById = (id: string) => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    ...getRestaurantReservationByIdQueryOptions(id),
    enabled: !!id && !!user,
  });
};

export const useVerifyReservationPickupByCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyReservationPickupByCodePayload) =>
      reservationsService.verifyReservationPickupByCode(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.restaurantLists(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.restaurantListById(variables.reservationId),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.restaurantList({
          id: variables.reservationId,
        }),
      });
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateReservationStatusPayload) => reservationsService.updateReservationStatus(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.restaurantLists(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.restaurantListById(variables.reservationId),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.restaurantList({
          id: variables.reservationId,
        }),
      });
    },
  });
};

// export const useCancelReservation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: CancelReservationPayload) => reservationsService.cancelReservation(payload),
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: reservationsQueryKeys.restaurantLists(),
//       });
//       queryClient.invalidateQueries({
//         queryKey: reservationsQueryKeys.restaurantListById(variables.reservationId),
//       });
//       queryClient.invalidateQueries({
//         queryKey: reservationsQueryKeys.restaurantList({
//           id: variables.reservationId,
//         }),
//       });
//     },
//   });
// };

// For consumers to update their own reservation status (replacement for the cancel endpoint)
export const useUpdateMyReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMyReservationStatusPayload) => reservationsService.updateMyReservationStatus(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.customerLists(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.reservationById(variables.reservationId),
      });
    },
  });
};
