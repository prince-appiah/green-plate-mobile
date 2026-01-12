import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useGetUserInfo } from "./use-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { tokenStorage } from "@/lib/token-storage";
import { transformError } from "@/lib/try-catch";
import { useAuthStore } from "@/stores/auth-store";
import { BaseApiResponse } from "@/lib/axios";
import { User } from "@/features/shared";

export const useGoogleSignin = () => {
  const { refetch, data: userInfoData } = useGetUserInfo();
  const { setUser, setLoading } = useAuthStore();

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
        mutate(userInfo.data.idToken, {
          onSuccess: async (data) => {
            // Save both access and refresh tokens
            if (data.data.accessToken && data.data.refreshToken) {
              await tokenStorage.setTokens(
                data.data.accessToken,
                data.data.refreshToken
              );
            }

            if (data.success) {
              setLoading(true);
              const user = await refetch();

              if (user.data?.success) {
                const response = user.data as BaseApiResponse<User>;
                // Set user directly in Zustand store
                if (response?.data) {
                  await setUser(response.data);
                  // Wait a tick to ensure state is updated before navigation
                  await new Promise((resolve) => setTimeout(resolve, 0));
                }
                setLoading(false);

                // Check onboarding first - if not completed, redirect and return early
                if (
                  !response.data.onboardingCompleted ||
                  response.data.role === null
                ) {
                  router.replace("/(onboarding)/welcome");
                  return; // Early return to prevent further navigation
                }

                // Only navigate to role-based routes if onboarding is completed
                if (response.data.role === "consumer") {
                  router.replace("/(consumers)");
                } else if (response.data.role === "restaurantOwner") {
                  router.replace("/(restaurants)");
                }
              } else {
                console.log("User info fetch failed");
                setLoading(false);
              }
            }
            // router.replace("/(onboarding)/role-selection");
          },
          onError: (error) => {
            setLoading(false);
            console.log(
              "Error occurred during mutation: ",
              JSON.stringify(transformError(error)),
              null,
              2
            );
          },
        });
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
      console.log("Logout successful");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out: ", error);
      // Clear tokens even if logout API call fails
      await tokenStorage.clearTokens();
      const { signOut } = useAuthStore.getState();
      await signOut(); // Clear user from Zustand store even on error
    }
  };

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: (idToken: string) => authService.googleSignin(idToken),
  });

  return { mutate, isPending, data, error, handleGoogleAuthInit, handleLogout };
};
