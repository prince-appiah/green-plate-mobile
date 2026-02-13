import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGetOnboardingStatus } from "@/features/onboarding";
import { useLocation } from "@/features/shared/hooks/use-location";
import { IUserRole } from "@/features/shared";

export default function LocationScreen() {
  const { data: onboardingStatus } = useGetOnboardingStatus();
  const role = onboardingStatus?.data?.role as IUserRole | undefined;
  const isConsumer = role === "consumer";

  const { location, isLoading, error, getCurrentLocation, hasPermission } =
    useLocation();
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  // Auto-request location on mount for consumers
  useEffect(() => {
    if (isConsumer && !hasRequestedLocation && !location && !isLoading) {
      setHasRequestedLocation(true);
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsumer, hasRequestedLocation, location, isLoading]);

  const handleGetLocation = () => {
    getCurrentLocation();
  };

  const handleContinue = () => {
    if (location) {
      // Navigate to preferences with coordinates
      router.push({
        pathname: "/(onboarding)/preferences",
        params: {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        },
      });
    }
  };

  // For restaurant owners, redirect to restaurant-info (location handled there)
  if (role === "restaurantOwner") {
    router.replace("/(onboarding)/restaurant-info");
    return null;
  }

  return (
    <CustomSafeAreaView useSafeArea>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="w-screen px-4"
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
              We need your location to find food deals near you
            </Text>
          </View>

          {/* Location Status */}
          <View className="flex-1 justify-center items-center mb-8">
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="text-base text-[#657c69] mt-4">
                  Getting your location...
                </Text>
              </View>
            ) : location ? (
              <View className="items-center">
                <View className="bg-[#16a34a] rounded-full w-20 h-20 items-center justify-center mb-4">
                  <Ionicons name="checkmark" size={40} color="#ffffff" />
                </View>
                <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">
                  Location Found
                </Text>
                <Text className="text-sm text-[#657c69] text-center">
                  Latitude: {location.latitude.toFixed(6)}
                </Text>
                <Text className="text-sm text-[#657c69] text-center">
                  Longitude: {location.longitude.toFixed(6)}
                </Text>
              </View>
            ) : error ? (
              <View className="items-center">
                <Ionicons name="location-outline" size={64} color="#ef4444" />
                <Text className="text-base text-[#ef4444] mt-4 text-center">
                  {error}
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="location-outline" size={64} color="#657c69" />
                <Text className="text-base text-[#657c69] mt-4 text-center">
                  Tap the button below to get your location
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="pb-8 space-y-4">
            {!location && !isLoading && (
              <TouchableOpacity
                onPress={handleGetLocation}
                disabled={isLoading || !hasPermission}
                className={`rounded-full h-14 flex-row items-center justify-center ${
                  isLoading || !hasPermission ? "bg-[#9ca3af]" : "bg-[#16a34a]"
                }`}
              >
                <Ionicons
                  name="location"
                  size={20}
                  color="#ffffff"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-semibold text-base">
                  Get My Location
                </Text>
              </TouchableOpacity>
            )}

            {location && (
              <TouchableOpacity
                onPress={handleContinue}
                className="rounded-full h-14 flex-row items-center justify-center bg-[#16a34a]"
              >
                <Text className="text-white font-semibold text-base mr-2">
                  Continue
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
