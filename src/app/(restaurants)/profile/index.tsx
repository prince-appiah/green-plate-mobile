import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useDeactivateAccount, useDeleteAccount } from "@/features/accounts";
import { useGoogleSignin } from "@/features/auth";
import { useGetMyRestaurantProfile } from "@/features/restaurants";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestaurantProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const user = useAuthStore((state) => state.user);
  const { mutate: deactivateAccount, isPending: isDeactivating } = useDeactivateAccount();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const { data: profileResponse } = useGetMyRestaurantProfile();
  const profile = profileResponse?.data;

  const { handleLogout } = useGoogleSignin();

  const menuItems = [
    {
      icon: "restaurant",
      label: "Restaurant Info",
      description: "Manage your restaurant details",
      onPress: () => router.push({ pathname: "/(restaurants)/profile/[userId]", params: { userId: user?.id } }),
    },
    // {
    //   icon: "time",
    //   label: "Operating Hours",
    //   description: "Set your pickup times",
    //   onPress: () => {},
    // },
    // {
    //   icon: "notifications",
    //   label: "Notifications",
    //   description: "Manage notification preferences",
    //   onPress: () => {},
    // },
    // {
    //   icon: "help-circle",
    //   label: "Help & Support",
    //   description: "Get help and contact support",
    //   onPress: () => {},
    // },
    {
      icon: "pause",
      label: "Deactivate Account",
      description: "Deactivate your account temporarily",
      onPress: () => {
        Alert.alert(
          "Deactivate Account",
          "Are you sure you want to deactivate your account? You can reactivate it later by contacting support.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Deactivate",
              style: "destructive",
              onPress: () => {
                deactivateAccount();
                // Alert.alert(
                //   "Account Deactivated",
                //   "Your account has been deactivated. You can reactivate it by contacting support.",
                // );
              },
            },
          ],
        );
      },
    },
    {
      icon: "trash",
      label: "Delete Account",
      description: "Permanently delete your account",
      onPress: () => {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete your account? This action cannot be undone. Please type 'DELETE' to confirm.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                deleteAccount(true);
              },
            },
          ],
        );
      },
    },
  ];

  return (
    <CustomSafeAreaView useSafeArea>
      <ScrollView contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">Profile</Text>
          <Text className="text-sm text-[#657c69]">Manage your restaurant account</Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 border border-[#e5e7eb] shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-[#16a34a] items-center justify-center mr-4">
              <Ionicons name="restaurant" size={40} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-[#1a2e1f] mb-1">{profile?.name || "Restaurant Name"}</Text>
              {user?.email && <Text className="text-sm text-[#657c69] mb-2">{user.email}</Text>}
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
            <Text className="text-[#657c69] font-semibold text-sm ml-2">Edit Profile</Text>
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
                <Text className="text-base font-semibold text-[#1a2e1f] mb-1">{item.label}</Text>
                <Text className="text-sm text-[#657c69]">{item.description}</Text>
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
          <Text className="text-[#ef4444] font-semibold text-base ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
