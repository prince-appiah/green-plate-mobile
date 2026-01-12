import React, { useEffect, ReactNode } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useGetUserInfo } from "@/features/auth";
import { User } from "@/features/shared";
import { BaseApiResponse } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";

function setupGoogleServices() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
    profileImageSize: 150,
  });
}

/**
 * AuthProvider - Handles app initialization:
 * - Sets up Google Sign-In services
 * - Syncs user from API on app load (for persisted sessions)
 *
 * Note: Login flow sets user directly in Zustand store.
 * This provider only handles initialization and keeping user in sync on app load.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userInfoData, isPending: isLoadingUser } = useGetUserInfo();
  const { setUser, setLoading, clearUser } = useAuthStore();

  useEffect(() => {
    setupGoogleServices();
  }, []);

  // Sync loading state
  useEffect(() => {
    setLoading(isLoadingUser);
  }, [isLoadingUser, setLoading]);

  // Sync user from API when userInfoData changes (for app initialization/refresh)
  // This ensures user is synced when app loads with a persisted session
  useEffect(() => {
    const response = userInfoData?.data as BaseApiResponse<User> | undefined;
    if (response?.success && response?.data) {
      setUser(response.data);
    } else if (response && !response.success && !isLoadingUser) {
      // If API call failed or returned no user data, clear user
      clearUser();
    }
  }, [userInfoData, isLoadingUser, setUser, clearUser]);

  return <>{children}</>;
}
