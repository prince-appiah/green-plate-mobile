import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import {
  useGetOnboardingStatus,
  useSelectOnboardingRole,
} from "@/features/onboarding";
import { IUserRole } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<IUserRole | null>(null);
  const { mutate, isPending } = useSelectOnboardingRole();

  const handleRoleSelect = (role: IUserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      mutate(selectedRole, {
        onSuccess: () => {
          // Navigate based on selected role
          if (selectedRole === "restaurantOwner") {
            router.push("/(onboarding)/restaurant-info");
          } else if (selectedRole === "consumer") {
            router.push("/(onboarding)/personal-info");
          }
        },
        onError: (error) => {
          console.error("Error selecting role:", error);
          // Could show an alert here
        },
      });
    }
  };

  return (
    <CustomSafeAreaView useSafeArea>
      <StatusBar barStyle="dark-content" />
      <View className="grow justify-center items-center px-6">
        <View className="items-center mb-12 w-full">
          <Ionicons
            name="people"
            size={80}
            color="#16a34a"
            style={{ marginBottom: 24 }}
          />
          <Text className="text-4xl font-bold text-[#1a2e1f] mb-4 text-center">
            Choose Your Role
          </Text>
          <Text className="text-lg text-[#657c69] text-center px-4 mb-8">
            Select how you'll be using Green Plate
          </Text>
        </View>

        {/* Role Selection Cards */}
        <View className="w-full max-w-sm space-y-4">
          {/* Consumer Option */}
          <TouchableOpacity
            onPress={() => handleRoleSelect("consumer")}
            className={`bg-white rounded-2xl p-6 border-2 ${
              selectedRole === "consumer"
                ? "border-[#16a34a] bg-[#f0fdf4]"
                : "border-[#e5e7eb]"
            }`}
          >
            <View className="flex-row items-center mb-3">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  selectedRole === "consumer" ? "bg-[#16a34a]" : "bg-[#eff2f0]"
                }`}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={selectedRole === "consumer" ? "#ffffff" : "#657c69"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-[#1a2e1f]">
                  Consumer
                </Text>
                <Text className="text-sm text-[#657c69] mt-1">
                  Find great deals on food
                </Text>
              </View>
              {selectedRole === "consumer" && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </View>
            <Text className="text-sm text-[#657c69] mt-2">
              Browse discounted meals, reduce food waste, and save money on
              quality food from local restaurants.
            </Text>
          </TouchableOpacity>

          {/* Restaurant Option */}
          <TouchableOpacity
            onPress={() => handleRoleSelect("restaurantOwner")}
            className={`bg-white rounded-2xl p-6 border-2 ${
              selectedRole === "restaurantOwner"
                ? "border-[#16a34a] bg-[#f0fdf4]"
                : "border-[#e5e7eb]"
            }`}
          >
            <View className="flex-row items-center mb-3">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  selectedRole === "restaurantOwner"
                    ? "bg-[#16a34a]"
                    : "bg-[#eff2f0]"
                }`}
              >
                <Ionicons
                  name="restaurant"
                  size={24}
                  color={
                    selectedRole === "restaurantOwner" ? "#ffffff" : "#657c69"
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-[#1a2e1f]">
                  Restaurant
                </Text>
                <Text className="text-sm text-[#657c69] mt-1">
                  Sell surplus food
                </Text>
              </View>
              {selectedRole === "restaurantOwner" && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </View>
            <Text className="text-sm text-[#657c69] mt-2">
              List your surplus food, reduce waste, and reach customers looking
              for great deals.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <View className="w-full max-w-sm mt-8">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedRole || isPending}
            className={`rounded-full h-14 flex-row items-center justify-center shadow-sm ${
              selectedRole && !isPending ? "bg-[#16a34a]" : "bg-[#9ca3af]"
            }`}
          >
            {isPending ? (
              <Text className="text-white font-semibold text-base">
                Loading...
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
    </CustomSafeAreaView>
  );
}
