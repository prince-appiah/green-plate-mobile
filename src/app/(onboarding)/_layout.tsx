import { useEffect } from "react";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGetOnboardingStatus } from "@/features/onboarding";
import { router, Stack, useSegments } from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";

export default function OnboardingLayout() {
  const { data, isPending } = useGetOnboardingStatus();
  const segments = useSegments();

  useEffect(() => {
    if (isPending || !data?.data) {
      return;
    }

    const status = data.data;
    const currentRoute = segments[segments.length - 1];

    // If onboarding is complete, redirect to appropriate dashboard
    if (status.onboardingCompleted) {
      if (status.role === "consumer") {
        router.replace("/(consumers)");
      } else if (status.role === "restaurantOwner") {
        router.replace("/(restaurants)");
      }
      return;
    }

    // Don't redirect if already on the correct screen
    if (currentRoute === "welcome" || currentRoute === "role-selection") {
      return;
    }

    // Redirect based on onboarding stage
    if (!status.roleSelected || !status.role) {
      if (currentRoute !== "role-selection") {
        router.replace("/(onboarding)/role-selection");
      }
      return;
    }

    if (!status.profileCompleted) {
      if (status.role === "consumer" && currentRoute !== "personal-info") {
        router.replace("/(onboarding)/personal-info");
      } else if (
        status.role === "restaurantOwner" &&
        currentRoute !== "restaurant-info"
      ) {
        router.replace("/(onboarding)/restaurant-info");
      }
      return;
    }

    // Profile completed but onboarding not complete
    if (status.role === "consumer" && currentRoute !== "preferences") {
      router.replace("/(onboarding)/preferences");
    }
  }, [data, isPending, segments]);

  if (isPending) {
    return (
      <CustomSafeAreaView useSafeArea>
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
      </CustomSafeAreaView>
    );
  }

  if (!data) {
    return (
      <CustomSafeAreaView useSafeArea>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#eff2f0",
          }}
        >
          <Text className="text-[#1a2e1f]">
            Error loading onboarding status
          </Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 300,
        contentStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="location" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="restaurant-info" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
