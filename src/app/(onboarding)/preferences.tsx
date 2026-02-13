import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  preferencesSchema,
  type PreferencesFormData,
  DIETARY_OPTIONS,
  useSubmitCustomerPreferences,
} from "@/features/onboarding";

export default function PreferencesScreen() {
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
  }>();
  const { mutate: submitCustomerPreferences, isPending } =
    useSubmitCustomerPreferences();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    mode: "onChange",
    defaultValues: {
      dietary: [],
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const dietary = watch("dietary");

  const toggleDietaryPreference = (
    pref: string,
    current: string[],
    onChange: (value: string[]) => void
  ) => {
    if (pref === "None") {
      onChange(["None"]);
    } else {
      const filtered = current.filter((p) => p !== "None");
      if (filtered.includes(pref)) {
        onChange(filtered.filter((p) => p !== pref));
      } else {
        onChange([...filtered, pref]);
      }
    }
  };

  const onSubmit = (data: PreferencesFormData) => {
    // Get location coordinates from route params
    const latitude = params.latitude ? parseFloat(params.latitude) : null;
    const longitude = params.longitude ? parseFloat(params.longitude) : null;

    if (!latitude || !longitude) {
      Alert.alert(
        "Location Required",
        "Please go back and allow location access to continue."
      );
      return;
    }

    // Submit preferences with location coordinates
    submitCustomerPreferences(
      {
        dietary: data.dietary.filter((p) => p !== "None"),
        location: {
          latitude,
          longitude,
        },
      },
      {
        onSuccess: () => {
          router.push("/(onboarding)/complete");
        },
        onError: (error) => {
          console.error("Error submitting preferences:", error);
          Alert.alert("Error", "Failed to save preferences. Please try again.");
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#eff2f0]">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 px-6 pt-8">
          {/* Header */}
          <View className="mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-[#1a2e1f] mb-2">
              Preferences
            </Text>
            <Text className="text-base text-[#657c69]">
              Help us personalize your experience
            </Text>
          </View>

          {/* Dietary Preferences */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-[#1a2e1f] mb-4">
              Dietary Preferences
            </Text>
            <Controller
              control={control}
              name="dietary"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap">
                  {DIETARY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() =>
                        toggleDietaryPreference(option, value, onChange)
                      }
                      className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                        value.includes(option)
                          ? "bg-[#16a34a] border-[#16a34a]"
                          : "bg-white border-[#e5e7eb]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          value.includes(option)
                            ? "text-white"
                            : "text-[#1a2e1f]"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.dietary && (
              <Text className="mt-2 text-sm text-red-500">
                {errors.dietary.message}
              </Text>
            )}
          </View>

          {/* Next Button */}
          <View className="pb-8">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isPending}
              className={`rounded-full h-14 flex-row items-center justify-center ${
                isValid && !isPending ? "bg-[#16a34a]" : "bg-[#9ca3af]"
              }`}
            >
              {isPending ? (
                <Text className="text-white font-semibold text-base">
                  Saving...
                </Text>
              ) : (
                <>
                  <Text className="text-white font-semibold text-base mr-2">
                    Continue
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
