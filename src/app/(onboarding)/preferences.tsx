import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "../../contexts/OnboardingContext";
import {
  preferencesSchema,
  type PreferencesFormData,
  DIETARY_OPTIONS,
  CUISINE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
} from "@/features/onboarding";

const BUDGET_OPTIONS = [
  { label: "$", value: "low" as const, description: "Budget-friendly" },
  { label: "$$", value: "medium" as const, description: "Moderate" },
  { label: "$$$", value: "high" as const, description: "Premium" },
];

export default function PreferencesScreen() {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    mode: "onChange",
    defaultValues: {
      dietaryPreferences: onboardingData.dietaryPreferences || [],
      favoriteCuisines: onboardingData.favoriteCuisines || [],
      budgetRange: (onboardingData.budgetRange as "low" | "medium" | "high") || "medium",
      radiusKm: 10,
    },
  });

  const dietaryPreferences = watch("dietaryPreferences");
  const favoriteCuisines = watch("favoriteCuisines");
  const budgetRange = watch("budgetRange");

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

  const toggleCuisine = (
    cuisine: string,
    current: string[],
    onChange: (value: string[]) => void
  ) => {
    if (current.includes(cuisine)) {
      onChange(current.filter((c) => c !== cuisine));
    } else {
      onChange([...current, cuisine]);
    }
  };

  const onSubmit = (data: PreferencesFormData) => {
    updateOnboardingData({
      dietaryPreferences: data.dietaryPreferences,
      favoriteCuisines: data.favoriteCuisines,
      budgetRange: data.budgetRange,
    });
    router.push("/(onboarding)/complete");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#eff2f0]">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
      >
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
              name="dietaryPreferences"
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
            {errors.dietaryPreferences && (
              <Text className="mt-2 text-sm text-red-500">
                {errors.dietaryPreferences.message}
              </Text>
            )}
          </View>

          {/* Favorite Cuisines */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-[#1a2e1f] mb-4">
              Favorite Cuisines
            </Text>
            <Controller
              control={control}
              name="favoriteCuisines"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap">
                  {CUISINE_OPTIONS.map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      onPress={() =>
                        toggleCuisine(cuisine, value || [], onChange)
                      }
                      className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                        (value || []).includes(cuisine)
                          ? "bg-[#16a34a] border-[#16a34a]"
                          : "bg-white border-[#e5e7eb]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          (value || []).includes(cuisine)
                            ? "text-white"
                            : "text-[#1a2e1f]"
                        }`}
                      >
                        {cuisine}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Budget Range */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-[#1a2e1f] mb-4">
              Budget Range
            </Text>
            <Controller
              control={control}
              name="budgetRange"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row justify-between">
                  {BUDGET_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => onChange(option.value)}
                      className={`flex-1 mx-1 py-4 rounded-xl border items-center ${
                        value === option.value
                          ? "bg-[#16a34a] border-[#16a34a]"
                          : "bg-white border-[#e5e7eb]"
                      }`}
                    >
                      <Text
                        className={`text-2xl font-bold mb-1 ${
                          value === option.value
                            ? "text-white"
                            : "text-[#1a2e1f]"
                        }`}
                      >
                        {option.label}
                      </Text>
                      <Text
                        className={`text-xs ${
                          value === option.value
                            ? "text-white"
                            : "text-[#657c69]"
                        }`}
                      >
                        {option.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.budgetRange && (
              <Text className="mt-2 text-sm text-red-500">
                {errors.budgetRange.message}
              </Text>
            )}
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
                Continue
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

