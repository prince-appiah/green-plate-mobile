import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push("/(onboarding)/role-selection");
  };

  return (
    <CustomSafeAreaView className="flex-1 bg-[#eff2f0]">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 justify-center items-center px-4">
        <View className="items-center mb-12">
          <Ionicons
            name="restaurant"
            size={80}
            color="#16a34a"
            style={{ marginBottom: 24 }}
          />
          <Text className="text-4xl font-bold text-[#1a2e1f] mb-4 text-center">
            Welcome to Green Plate
          </Text>
          <Text className="text-lg text-[#657c69] text-center px-4">
            Let's set up your profile to get you the best food deals and reduce waste
          </Text>
        </View>

        <View className="w-full max-w-sm mt-8">
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-[#16a34a] rounded-full h-14 flex-row items-center justify-center shadow-sm"
          >
            <Text className="text-white font-semibold text-base mr-2">
              Get Started
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  );
}

