import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGetOnboardingStatus } from "@/features/onboarding";
import { IUserRole } from "@/features/shared";
import { useEffect } from "react";

export default function CompleteScreen() {
  const { data: onboardingStatus } = useGetOnboardingStatus();
  const role = onboardingStatus?.data?.role as IUserRole | undefined;
  const isRestaurant = role === "restaurantOwner";
  const preferencesCompleted = onboardingStatus?.data?.preferencesCompleted;

  // Auto-navigate if onboarding is complete
  useEffect(() => {
    if (onboardingStatus?.data?.onboardingCompleted) {
      if (role === "consumer") {
        router.replace("/(consumers)");
      } else if (role === "restaurantOwner") {
        router.replace("/(restaurants)");
      }
    }
  }, [onboardingStatus, role]);

  const handleFinish = () => {
    if (isRestaurant) {
      // Restaurant onboarding completion would be handled differently
      router.replace("/(restaurants)");
      return;
    }

    // For customers, preferences are already submitted, just navigate
    if (preferencesCompleted) {
      router.replace("/(consumers)");
    } else {
      // If preferences not completed, go back to preferences
      router.push("/(onboarding)/preferences");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#eff2f0]">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-12">
          <View className="bg-[#16a34a] rounded-full w-24 h-24 items-center justify-center mb-6">
            <Ionicons name="checkmark" size={48} color="#ffffff" />
          </View>
          <Text className="text-4xl font-bold text-[#1a2e1f] mb-4 text-center">
            You're All Set!
          </Text>
          <Text className="text-lg text-[#657c69] text-center px-4">
            {isRestaurant
              ? "Your restaurant profile is complete. Start listing your surplus food and help reduce waste while reaching new customers."
              : "Your profile is complete. Start exploring amazing food deals and help reduce waste."}
          </Text>
        </View>

        <View className="w-full max-w-sm mt-8">
          <TouchableOpacity
            onPress={handleFinish}
            className="rounded-full h-14 flex-row items-center justify-center shadow-sm bg-[#16a34a]"
          >
            <Text className="text-white font-semibold text-base mr-2">
              Get Started
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

