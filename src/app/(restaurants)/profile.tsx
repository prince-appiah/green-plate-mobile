import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useAuthStore } from "@/stores/auth-store";
import { useGoogleSignin } from "@/features/auth";
import { useGetRestaurantProfile } from "@/features/restaurants";

export default function RestaurantProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const user = useAuthStore((state) => state.user);

  const { data: profileResponse } = useGetRestaurantProfile();
  const profile = profileResponse?.data;

  const { handleLogout } = useGoogleSignin();

  const menuItems = [
    {
      icon: "restaurant",
      label: "Restaurant Info",
      description: "Manage your restaurant details",
      onPress: () => { },
    },
    {
      icon: "time",
      label: "Operating Hours",
      description: "Set your pickup times",
      onPress: () => { },
    },
    {
      icon: "notifications",
      label: "Notifications",
      description: "Manage notification preferences",
      onPress: () => { },
    },
    {
      icon: "help-circle",
      label: "Help & Support",
      description: "Get help and contact support",
      onPress: () => { },
    },
    {
      icon: "document-text",
      label: "Terms & Privacy",
      description: "View terms and privacy policy",
      onPress: () => { },
    },
  ];

  return (
    <CustomSafeAreaView useSafeArea>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">
            Profile
          </Text>
          <Text className="text-sm text-[#657c69]">
            Manage your restaurant account
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-[#16a34a] items-center justify-center mr-4">
              <Ionicons name="restaurant" size={40} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-[#1a2e1f] mb-1">
                {profile?.name || "Restaurant Name"}
              </Text>
              {/* <Text className="text-sm text-[#657c69] mb-2">
                {profile?.email || "restaurant@example.com"}
              </Text> */}
              {/* <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text className="text-sm font-semibold text-[#1a2e1f] ml-1">
                  0.0
                </Text>
                <Text className="text-xs text-[#657c69] ml-1">
                  (0 reviews)
                </Text>
              </View> */}
            </View>
          </View>
          <TouchableOpacity className="bg-[#eff2f0] rounded-xl py-3 flex-row items-center justify-center">
            <Ionicons name="create-outline" size={18} color="#657c69" />
            <Text className="text-[#657c69] font-semibold text-sm ml-2">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="bg-white rounded-2xl p-4 flex-row items-center mb-3 border border-[#e5e7eb] shadow-sm"
            >
              <View className="w-12 h-12 rounded-xl bg-[#eff2f0] items-center justify-center mr-4">
                <Ionicons name={item.icon as any} size={20} color="#657c69" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#1a2e1f] mb-1">
                  {item.label}
                </Text>
                <Text className="text-sm text-[#657c69]">
                  {item.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#657c69" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#fee2e2] rounded-2xl p-4 flex-row items-center justify-center mb-6"
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-[#ef4444] font-semibold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
