import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOnboardingStatus } from "@/features/onboarding";
import { useAuthStore } from "@/stores/auth-store";
import { BaseApiResponse } from "@/lib/axios";
import { OnboardingStatusResponse } from "@/features/onboarding/services/onboarding-types";
import { Button } from "@/components/ui/Button";

interface OnboardingGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Loading component for better UX
const LoadingView = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eff2f0",
    }}
  >
    <ActivityIndicator size="large" color="#16a34a" />
    <Text className="mt-4 text-sm text-[#657c69]">Loading...</Text>
  </View>
);

// Error/No User component for better UX
const NoUserView = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eff2f0",
      padding: 20,
    }}
  >
    <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">
      Authentication Required
    </Text>
    <Text className="text-sm text-[#657c69] text-center">
      Please log in to continue
    </Text>
    <Button variant="primary" onPress={() => router.replace("/(auth)/login")}>
      Log in
    </Button>
  </View>
);

// Redirecting component for better UX
const RedirectingView = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eff2f0",
    }}
  >
    <ActivityIndicator size="large" color="#16a34a" />
    <Text className="mt-4 text-sm text-[#657c69]">Redirecting...</Text>
  </View>
);

export function OnboardingGuard({ children, fallback }: OnboardingGuardProps) {
  const { data: onboardingStatus, isPending, error } = useGetOnboardingStatus();
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoading);

  console.log("OnboardingGuard - user:", JSON.stringify(user, null, 2));
  console.log("OnboardingGuard - isLoadingUser:", isLoadingUser);
  console.log("OnboardingGuard - isOnboardingPending:", isPending);
  console.log("OnboardingGuard - onboardingError:", error);

  // Extract the actual onboarding status data from the nested response
  const statusResponse = onboardingStatus?.data as
    | BaseApiResponse<OnboardingStatusResponse>
    | undefined;
  const status = statusResponse?.data;

  useEffect(() => {
    // Don't redirect if still loading user, onboarding status, or no user
    if (isLoadingUser || isPending || !user) {
      console.log(
        "OnboardingGuard - Waiting: isLoadingUser:",
        isLoadingUser,
        "isPending:",
        isPending,
        "user:",
        !!user
      );
      return;
    }

    // If no onboarding status data, wait
    if (!status) {
      console.log("OnboardingGuard - No onboarding status data yet");
      return;
    }

    console.log("OnboardingGuard - Status:", JSON.stringify(status, null, 2));

    // If onboarding is complete, allow access (don't redirect)
    if (status.onboardingCompleted) {
      console.log("OnboardingGuard - Onboarding completed, allowing access");
      return;
    }

    // Determine which onboarding step to redirect to
    if (!status.roleSelected || !status.role) {
      console.log("OnboardingGuard - Redirecting to role-selection");
      router.replace("/(onboarding)/role-selection");
      return;
    }

    // Role is selected, check profile completion
    if (!status.profileCompleted) {
      console.log("OnboardingGuard - Redirecting to profile completion");
      // Redirect based on role
      if (status.role === "consumer") {
        router.replace("/(onboarding)/personal-info");
      } else if (status.role === "restaurantOwner") {
        router.replace("/(onboarding)/restaurant-info");
      }
      return;
    }

    // Profile is completed but onboarding is not complete
    // For customers, continue to preferences
    if (status.role === "consumer") {
      console.log("OnboardingGuard - Redirecting to preferences");
      router.replace("/(onboarding)/preferences");
    } else if (status.role === "restaurantOwner") {
      console.log("OnboardingGuard - Redirecting to restaurant complete");
      router.replace("/(onboarding)/complete");
    }
  }, [onboardingStatus, isPending, user, isLoadingUser, status]);

  // Show loading state while user or onboarding status is loading
  if (isLoadingUser || isPending) {
    console.log("OnboardingGuard - Showing loading state");
    return fallback || <LoadingView />;
  }

  // If no user, show no user view (AuthGuard should handle this, but just in case)
  if (!user) {
    console.log("OnboardingGuard - No user found");
    return fallback || <NoUserView />;
  }

  // If onboarding status is still loading or not available, show loading
  if (!statusResponse || !status) {
    console.log("OnboardingGuard - Onboarding status not available yet");
    return fallback || <LoadingView />;
  }

  // If onboarding is not complete, show redirecting view (redirect is happening)
  if (!status.onboardingCompleted) {
    console.log("OnboardingGuard - Onboarding not completed, redirecting");
    return fallback || <RedirectingView />;
  }

  // Onboarding is complete, render children
  console.log("OnboardingGuard - Onboarding completed, rendering children");
  return children;
}
