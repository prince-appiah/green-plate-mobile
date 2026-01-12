import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { restaurantsService } from "../services/restaurants.service";
import { restaurantsQueryKeys } from "./restaurants-query-keys";
import {
  UpdateRestaurantProfilePayload,
  UpdateRestaurantSettingsPayload,
} from "../services/restaurants-types";
import { useAuthStore } from "@/stores/auth-store";

const getRestaurantStatsQueryOptions = (email: string) => ({
  queryKey: restaurantsQueryKeys.stats(email),
  queryFn: () => restaurantsService.getMyRestaurantStats(),
});

export function useGetRestaurantProfile() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: restaurantsQueryKeys.profile(user?.id!),
    queryFn: () => restaurantsService.getMyRestaurantProfile(),
  });
}

export function useUpdateRestaurantProfile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (payload: UpdateRestaurantProfilePayload) =>
      restaurantsService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: restaurantsQueryKeys.profile(user?.id!),
      });
    },
  });
}

export function useGetRestaurantStats() {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);
  return useQuery({
    ...getRestaurantStatsQueryOptions(user?.email!),
    enabled: !!user?.email,
  });
}

export function useGetRestaurantStatsSuspense() {
  const user = useAuthStore((state) => state.user);
  return useSuspenseQuery({ ...getRestaurantStatsQueryOptions(user?.email!) });
}

export function useUpdateRestaurantSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRestaurantSettingsPayload) =>
      restaurantsService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: restaurantsQueryKeys.settings(),
      });
    },
  });
}

export function useGetRestaurantById(restaurantId: string) {
  return useQuery({
    queryKey: restaurantsQueryKeys.detail(restaurantId),
    queryFn: () => restaurantsService.getRestaurantById(restaurantId),
    enabled: !!restaurantId,
  });
}
