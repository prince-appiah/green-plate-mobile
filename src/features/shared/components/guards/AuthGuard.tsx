import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuthStore } from "@/stores/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireOnboarding = true,
  fallback,
}: AuthGuardProps) {
  const user = useAuthStore((state) => state.user);
  const userLoading = useAuthStore((state) => state.isLoading);
  const { isOnboardingComplete } = useOnboarding();
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (requireOnboarding) {
      isOnboardingComplete().then((complete) => {
        setOnboardingComplete(complete);
        setOnboardingLoading(false);
        if (!complete) {
          router.replace("/(onboarding)/welcome");
        }
      });
    } else {
      setOnboardingLoading(false);
    }
  }, [user, userLoading, requireOnboarding, isOnboardingComplete]);

  if (userLoading || onboardingLoading) {
    return (
      fallback || (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      )
    );
  }

  if (!user) {
    return fallback || null;
  }

  if (requireOnboarding && !onboardingComplete) {
    return fallback || null;
  }

  return <>{children}</>;
}
