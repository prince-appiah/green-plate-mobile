import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useGetUserInfo } from "./use-auth";

import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/stores/auth-store";
import { router } from "expo-router";
import { authQueryKeys } from "./auth-query-keys";
import { ONBOARDING_KEYS } from "@/features/onboarding";

export const useGoogleSignin = () => {
  const { refetch, data: userInfoData } = useGetUserInfo();
  const { setUser, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, data, error } = useMutation({
    mutationFn: (idToken: string) => authService.googleSignin(idToken),
    onSuccess: async (data) => {
      if (data.success) {
        setLoading(true);
        // Save both access and refresh tokens
        if (data.data.accessToken && data.data.refreshToken) {
          await tokenStorage.setTokens(
            data.data.accessToken,
            data.data.refreshToken
          );
        }

        // CRITICAL: Remove stale user info cache BEFORE refetching
        // This ensures we get fresh data for the new user, not cached data from previous user
        queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });

        // Also remove onboarding status cache to prevent stale role data
        queryClient.removeQueries({ queryKey: ONBOARDING_KEYS.status });

        // Now refetch with fresh cache
        const user = await refetch();

        if (user.data?.success) {
          console.log("Fetched user info: ", user.data);
          const response = user.data;
          // Set user directly in Zustand store
          if (response?.data) {
            setLoading(false);

            // Invalidate and wait for onboarding status to refetch before navigation
            queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
            queryClient.invalidateQueries({
              queryKey: authQueryKeys.getUserInfo(),
            });

            // Wait for onboarding status to refetch to ensure we have fresh data
            await queryClient.refetchQueries({
              queryKey: ONBOARDING_KEYS.status,
            });

            // Check onboarding first - if not completed, redirect and return early
            if (
              !response.data.onboardingCompleted ||
              response.data.role === null
            ) {
              router.replace("/(onboarding)/welcome");
              return; // Early return to prevent further navigation
            }

            // Only navigate to role-based routes if onboarding is completed
            // Use the role from the user response directly (not from cached onboarding status)
            await setUser(response.data);
            if (response.data.role === "consumer") {
              router.replace("/(consumers)");
            } else if (response.data.role === "restaurantOwner") {
              router.replace("/(restaurants)");
            }
          }
        } else {
          console.log("User info fetch failed");
          setLoading(false);
        }
      }
      // router.replace("/(onboarding)/role-selection");
    },
  });

  const handleGoogleAuthInit = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (isSuccessResponse(userInfo)) {
        // const { idToken, user } = userInfo;
        if (!userInfo.data.idToken) {
          console.log("No idToken found");
          return;
        }
        await mutateAsync(userInfo.data.idToken);
      } else {
        console.log("User is not signed in");
      }
    } catch (error) {
      setLoading(false);
      if (isErrorWithCode(error)) {
        console.log("Erro with code: ", error);
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            console.log("Account exists with different credential");
            break;
          case "auth/invalid-credential":
            console.log("Invalid credential");
            break;
          default:
            console.log("Unknown error");
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { signOut } = useAuthStore.getState();
      // await authService.logout();
      await tokenStorage.clearTokens(); // Clear both access and refresh tokens
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await signOut(); // Clear user from Zustand store

      // Remove the cached user info query data specifically
      queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });
      // Clear React Query cache to remove stale data from previous user
      queryClient.clear(); // Clear all cached queries

      console.log("Logout successful");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out: ", error);
      // Clear tokens even if logout API call fails
      await tokenStorage.clearTokens();

      // Clear React Query cache even on error
      queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });
      queryClient.clear();
      const { signOut } = useAuthStore.getState();
      await signOut(); // Clear user from Zustand store even on error
      router.replace("/(auth)/login");
    }
  };

  return {
    mutateAsync,
    isPending,
    data,
    error,
    handleGoogleAuthInit,
    handleLogout,
  };
};
