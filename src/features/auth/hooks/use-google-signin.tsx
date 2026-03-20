import { ONBOARDING_KEYS } from "@/features/onboarding";
import axiosInstanceapi from "@/lib/axios";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/stores/auth-store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { mapSessionUserToBaseUser } from "../utils/session-mapper";
import { authQueryKeys } from "./auth-query-keys";
import { useGetUserInfo } from "./use-auth";

const AUTH_GOOGLE_PATH = "/auth/google";

export const useGoogleSignin = () => {
  const { refetch, data: userInfoData } = useGetUserInfo();
  const { setUser, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutateAsync: signInWithGoogle, isPending } = useMutation({
    mutationFn: async () => {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        throw new Error("Play services not available");
      }
      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type !== "success") {
        throw new Error("Google sign-in was cancelled or failed");
      }
      const idToken = (signInResult.data as { idToken?: string } | undefined)?.idToken ?? null;
      if (!idToken) {
        throw new Error("No ID token from Google");
      }
      const res = await axiosInstanceapi.post<{
        success: boolean;
        data: {
          accessToken: string;
          refreshToken: string;
          user: Record<string, unknown>;
        };
      }>(AUTH_GOOGLE_PATH, { token: idToken });
      const payload = res.data?.data;
      if (!payload) {
        throw new Error("Backend sign-in failed");
      }
      const { accessToken, refreshToken, user } = payload;
      await tokenStorage.setTokens(accessToken, refreshToken);
      const mappedUser = mapSessionUserToBaseUser(
        user ? { ...user, id: String(user.id), userId: String(user.id) } : null,
      );
      const roleNotSelected = user && (user as { role?: string | null }).role == null;
      return { user: mappedUser, roleNotSelected };
    },
    onSuccess: async (result) => {
      if (!result.user) return;
      setLoading(true);
      queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });
      queryClient.removeQueries({ queryKey: ONBOARDING_KEYS.status });
      await setUser(result.user);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ONBOARDING_KEYS.status });
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.getUserInfo(),
      });
      await queryClient.refetchQueries({ queryKey: ONBOARDING_KEYS.status });

      if (!result.user.onboardingCompleted || result.roleNotSelected) {
        router.replace("/(onboarding)/welcome");
        return;
      }
      if (result.user.role === "consumer") {
        router.replace("/(consumers)");
      } else if (result.user.role === "restaurantOwner") {
        router.replace("/(restaurants)");
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        console.error("Google sign-in error inside hook:", error.response?.data);
      }
      setLoading(false);
    },
  });

  const handleGoogleAuthInit = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setLoading(false);
      console.error("Google sign-in error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      const { signOut } = useAuthStore.getState();
      await signOut();

      queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });
      queryClient.clear();

      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
      const { signOut } = useAuthStore.getState();
      await signOut();
      queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });
      queryClient.clear();
      router.replace("/(auth)/login");
    }
  };

  return {
    mutateAsync: signInWithGoogle,
    isPending,
    handleGoogleAuthInit,
    handleLogout,
  };
};
