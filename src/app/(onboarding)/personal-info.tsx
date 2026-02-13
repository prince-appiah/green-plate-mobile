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
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { Input } from "@/components/ui/Input/input";
import {
  personalInfoSchema,
  useSubmitCustomerBasicInfo,
  useGetOnboardingStatus,
  type PersonalInfoFormData,
} from "@/features/onboarding";

export default function PersonalInfoScreen() {
  const { data: onboardingStatus } = useGetOnboardingStatus();
  const { mutate: submitCustomerBasicInfo, isPending } =
    useSubmitCustomerBasicInfo();

  // Get phoneNumber from server if available (though API may not return it)
  const phoneNumber = ""; // API doesn't return saved phoneNumber, so start fresh

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: phoneNumber,
    },
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    // Submit only phoneNumber to API (fullName is collected but not in API payload)
    submitCustomerBasicInfo(
      { phoneNumber: data.phoneNumber.trim() },
      {
        onSuccess: () => {
          router.push("/(onboarding)/location");
        },
        onError: (error) => {
          console.error("Error submitting customer basic info:", error);
        },
      }
    );
  };

  return (
    <CustomSafeAreaView useSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 pt-6"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="w-screen px-4"
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-8 w-full">
              <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#1a2e1f] mb-2">
                Personal Information
              </Text>
              <Text className="text-base text-[#657c69]">
                Tell us a bit about yourself
              </Text>
            </View>

            {/* Form */}
            <View className="flex-1 w-full">
              <Input<PersonalInfoFormData>
                control={control}
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
                hasError={!!errors.fullName}
              />

              <Input<PersonalInfoFormData>
                control={control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                hasError={!!errors.phoneNumber}
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
