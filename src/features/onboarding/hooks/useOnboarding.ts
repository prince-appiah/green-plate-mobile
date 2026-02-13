import { IUserRole } from "@/features/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RestaurantOnboardingPayload,
  SubmitCustomerBasicInfoPayload,
  SubmitCustomerPreferencesPayload,
} from "../services/onboarding-types";
import { onboardingService } from "../services/onboarding.service";

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
    onSuccess: (data, role) => {
      // Optimistically update the cache immediately
      queryClient.setQueryData(ONBOARDING_KEYS.status, (oldData: any) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            roleSelected: true,
            role,
            roleSelectedAt: new Date(),
          },
        };
      });
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
    onSuccess: async (data) => {
      if (data.success) {
        // const localRefreshToken = await tokenStorage.getRefreshToken();
        // const refreshTokenResponse = await refreshAccessToken(localRefreshToken!);
        // if (refreshTokenResponse.success) {
        //   await tokenStorage.setTokens(
        //     refreshTokenResponse.data.accessToken,
        //     refreshTokenResponse.data.refreshToken || ""
        //   );
        // }
        queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
      }
    },
  });

  return mutation;
};

export const useSubmitCustomerBasicInfo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SubmitCustomerBasicInfoPayload) =>
      onboardingService.submitCustomerBasicInfo(payload),
    onSuccess: (data) => {
      if (data.success) {
        // Optimistically update the cache immediately
        queryClient.setQueryData(ONBOARDING_KEYS.status, (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              profileCompleted: true,
              profileCompletedAt: new Date(),
            },
          };
        });
        queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
      } else {
        console.error("Error submitting customer basic info:", data.message);
      }
    },
  });

  return mutation;
};

export const useSubmitCustomerPreferences = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: SubmitCustomerPreferencesPayload) =>
      onboardingService.submitCustomerPreferences(payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
        queryClient.setQueryData(ONBOARDING_KEYS.status, (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              preferencesCompleted: true,
              preferencesCompletedAt: new Date(),
            },
          };
        });
      } else {
        console.error("Error submitting customer preferences:", data.message);
      }
    },
  });
  return mutation;
};

export { ONBOARDING_KEYS };
