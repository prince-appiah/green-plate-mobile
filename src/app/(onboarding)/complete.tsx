import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import {
  useCompleteCustomerOnboarding,
  useGetOnboardingStatus,
} from "@/features/onboarding";
import { IUserRole } from "@/features/shared";

export default function CompleteScreen() {
  const { onboardingData } = useOnboarding();
  const { data: onboardingStatus } = useGetOnboardingStatus();
  const { mutate: completeCustomerOnboarding, isPending } =
    useCompleteCustomerOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = onboardingStatus?.data?.role as IUserRole | undefined;
  const isRestaurant = role === "restaurantOwner";

  const handleFinish = () => {
    if (isRestaurant) {
      // Restaurant onboarding completion would be handled differently
      router.replace("/(restaurants)");
      return;
    }

    // For customers, submit onboarding data
    if (!onboardingData.dietaryPreferences) {
      Alert.alert(
        "Missing Information",
        "Please complete all onboarding steps before finishing."
      );
      return;
    }

    setIsSubmitting(true);
    completeCustomerOnboarding(
      {
        dietary: onboardingData.dietaryPreferences.filter((p) => p !== "None"),
        radiusKm: 10, // Default radius, can be made configurable later
      },
      {
        onSuccess: () => {
          router.replace("/(consumers)");
        },
        onError: (error) => {
          console.error("Error completing onboarding:", error);
          Alert.alert(
            "Error",
            "Failed to complete onboarding. Please try again."
          );
          setIsSubmitting(false);
        },
      }
    );
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
            disabled={isPending || isSubmitting}
            className={`rounded-full h-14 flex-row items-center justify-center shadow-sm ${
              isPending || isSubmitting
                ? "bg-[#9ca3af]"
                : "bg-[#16a34a]"
            }`}
          >
            {isPending || isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text className="text-white font-semibold text-base mr-2">
                  Get Started
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

