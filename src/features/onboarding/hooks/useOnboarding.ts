import { IUserRole } from "@/features/shared";
import axiosInstanceapi, { BaseApiResponse } from "@/lib/axios";
import { handleAsync } from "@/lib/try-catch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onboardingService } from "../services/onboarding.service";
import {
  CustomerOnboardingPayload,
  RestaurantOnboardingPayload,
} from "../services/onboarding-types";

const ONBOARDING_KEYS = {
  status: ["onboarding"] as const,
};

export const useGetOnboardingStatus = () => {
  return useQuery({
    queryKey: ONBOARDING_KEYS.status,
    queryFn: () => onboardingService.getOnboardingStatus(),
    // select: (data) => ({
    //   ...data.data,
    // }),
  });
};

export const useSelectOnboardingRole = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (role: IUserRole) =>
      onboardingService.selectOnboardingRole(role),
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
    },
  });

  return mutation;
};

export const useCompleteRestaurantOnboarding = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: RestaurantOnboardingPayload) =>
      onboardingService.completeRestaurantOnboarding(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
    },
  });

  return mutation;
};

export const useCompleteCustomerOnboarding = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CustomerOnboardingPayload) =>
      onboardingService.completeCustomerOnboarding(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
    },
  });

  return mutation;
};

export { ONBOARDING_KEYS };
