import { useGetUserInfo } from "@/features/auth";
import { useAuthStore } from "@/stores/auth-store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { ReactNode, useEffect } from "react";

/**
 * AuthProvider - Syncs user from JWT session (GET /auth/me with Bearer token).
 * Login flow: React Native Google Sign-In -> idToken -> POST /auth/google -> store token, set user.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (webClientId) {
      GoogleSignin.configure({ webClientId });
    }
  }, []);
  const { data: userInfoData, isPending: isLoadingUser } = useGetUserInfo();
  const { setUser, setLoading, signOut, user } = useAuthStore();

  useEffect(() => {
    setLoading(isLoadingUser);
  }, [isLoadingUser, setLoading]);

  useEffect(() => {
    if (isLoadingUser) return;

    const response = userInfoData;
    if (response?.success && response?.data) {
      if (!user || user.id === response.data.id) {
        setUser(response.data);
      }
    } else if (response && !response.success && !isLoadingUser) {
      signOut();
    }
  }, [userInfoData, isLoadingUser, user, setUser, signOut]);

  return <>{children}</>;
}
