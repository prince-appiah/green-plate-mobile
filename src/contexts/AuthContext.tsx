import { useGetUserInfo } from "@/features/auth";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/stores/auth-store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { ReactNode, useEffect, useMemo } from "react";

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
  const { setUser, setLoading, signOut, user } = useAuthStore();

  const userResponse = useMemo(() => {
    return userInfoData;
  }, [userInfoData]);

  useEffect(() => {
    setupGoogleServices();
  }, []);

  // Sync loading state
  useEffect(() => {
    setLoading(isLoadingUser);
  }, [isLoadingUser, setLoading]);

  // Sync user from API when userInfoData changes (for app initialization/refresh)
  // This ensures user is synced when app loads with a persisted session
  // useEffect(() => {
  //   const response = userInfoData?.data as BaseApiResponse<User> | undefined;
  //   if (response?.success && response?.data) {
  //     setUser(response.data);
  //   } else if (response && !response.success && !isLoadingUser) {
  //     // If API call failed or returned no user data, clear user
  //     signOut();
  //   }
  // }, [userInfoData, isLoadingUser, setUser, signOut]);

  useEffect(() => {
    // Don't sync user if we're loading
    if (isLoadingUser) {
      return;
    }

    // Check if tokens exist before syncing user
    // If no tokens, don't set user even if API returns data (could be stale cache)
    const checkTokens = async () => {
      const token = await tokenStorage.getToken();
      if (!token) {
        // No token means user is logged out, don't sync
        return;
      }

      if (userResponse) {
        if (userResponse.success && userResponse.data) {
          // Only update if user data is different (prevents unnecessary rerenders)
          // CRITICAL: Also check if the user ID matches to prevent overwriting with stale data
          // If the current user in store has a different ID, don't overwrite it (login flow is handling it)
          if (!user) {
            // No user in store, safe to set
            setUser(userResponse.data);
          } else if (user.id === userResponse.data.id) {
            // Same user, safe to update
            setUser(userResponse.data);
          } else {
            // Different user ID - this might be stale cache from previous user
            // Skip updating to prevent overwriting the user that was just set during login
            console.log(
              "Skipping user sync - potential stale cache or different user"
            );
            return;
          }
        } else if (!userResponse.success) {
          // Only sign out if we have an explicit failure response
          signOut();
        }
      }
    };

    checkTokens();
  }, [userResponse, isLoadingUser, user, setUser, signOut]);

  return <>{children}</>;
}
