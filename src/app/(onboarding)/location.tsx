import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "../../contexts/OnboardingContext";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { Input } from "@/components/ui/Input/input";
import {
  locationSchema,
  type LocationFormData,
} from "@/features/onboarding";

export default function LocationScreen() {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    mode: "onChange",
    defaultValues: {
      address: onboardingData.address || "",
      city: onboardingData.city || "",
      state: onboardingData.state || "",
      zipCode: onboardingData.zipCode || "",
    },
  });

  const onSubmit = (data: LocationFormData) => {
    updateOnboardingData({
      address: data.address.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      zipCode: data.zipCode.trim(),
    });
    // Navigate based on role
    if (onboardingData.role === "restaurant") {
      router.push("/(onboarding)/restaurant-info");
    } else {
      router.push("/(onboarding)/preferences");
    }
  };

  return (
    <CustomSafeAreaView useSafeArea>
      {/* <StatusBar barStyle="dark-content" /> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-screen px-4"
      >
        <ScrollView
          // contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-8">
              <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#1a2e1f] mb-2">
                Location
              </Text>
              <Text className="text-base text-[#657c69]">
                {onboardingData.role === "restaurant"
                  ? "Where is your restaurant located?"
                  : "Where should we deliver your food?"}
              </Text>
            </View>

            {/* Form */}
            <View className="flex-1">
              <Input<LocationFormData>
                control={control}
                name="address"
                label="Street Address"
                placeholder="Enter your address"
                autoCapitalize="words"
                hasError={!!errors.address}
              />

              <Input<LocationFormData>
                control={control}
                name="city"
                label="City"
                placeholder="Enter your city"
                autoCapitalize="words"
                hasError={!!errors.city}
              />

              <Input<LocationFormData>
                control={control}
                name="state"
                label="State"
                placeholder="Enter your state"
                autoCapitalize="words"
                hasError={!!errors.state}
              />

              <Input<LocationFormData>
                control={control}
                name="zipCode"
                label="Zip Code"
                placeholder="Enter your zip code"
                keyboardType="number-pad"
                hasError={!!errors.zipCode}
              />
            </View>

            {/* Next Button */}
            <View className="pb-8">
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                className={`rounded-full h-14 flex-row items-center justify-center ${
                  isValid ? "bg-[#16a34a]" : "bg-[#9ca3af]"
                }`}
              >
                <Text className="text-white font-semibold text-base mr-2">
                  Next
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
}
