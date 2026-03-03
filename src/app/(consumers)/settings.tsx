import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGoogleSignin } from "@/features/auth";
import { promptLoginForProtectedAction } from "@/features/auth/utils/prompt-login";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SettingsView = "main" | "payment";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const [currentView, setCurrentView] = useState<SettingsView>("main");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const userId = useAuthStore((state) => state.user?.id);
  const isGuest = !userId;
  const { handleLogout } = useGoogleSignin();

  const handleProtectedSettingAction = (callback?: () => void) => {
    if (isGuest) {
      promptLoginForProtectedAction("Please log in to access account settings.");
      return;
    }

    callback?.();
  };

  if (currentView === "payment") {
    // TODO: Implement PaymentMethodsScreen
    return null;
  }

  const settingsGroups = [
    {
      title: "Notifications",
      items: [
        {
          icon: "notifications-outline" as const,
          label: "Push Notifications",
          description: notificationsEnabled ? "Enabled" : "Not enabled",
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
          value: null,
          disabled: true,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "moon-outline" as const,
          label: "Dark Mode",
          description: "Coming soon",
          hasSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled,
          value: null,
          disabled: true,
          onClick: () => {},
        },
        {
          icon: "language-outline" as const,
          label: "Language",
          value: "English",
          disabled: false,
          hasSwitch: false,
          switchChange: false,
          onSwitchChange: () => {},
          onClick: () => {},
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: "shield-checkmark-outline" as const,
          label: "Privacy & Security",
          disabled: false,
          description: "Manage your privacy and security settings",
          hasSwitch: false,
          value: null,
          switchChange: false,
          switchValue: false,
          onSwitchChange: () => {},
          onClick: () => handleProtectedSettingAction(),
        },
        // {
        //   icon: "refresh-outline" as const,
        //   label: "Reset Onboarding",
        //   description: "Start fresh",
        //   disabled: false,
        //   hasSwitch: false,
        //   switchValue: false,
        //   switchChange: false,
        //   value: null,
        //   onSwitchChange: () => {},
        //   onClick: () => handleProtectedSettingAction(),
        // },
      ],
    },
  ];

  return (
    <CustomSafeAreaView useSafeArea>
      <View className="">
        <Text className="text-2xl font-bold text-[#1a2e1f] mb-6">Settings</Text>

        <ScrollView
          className=""
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
        >
          {(settingsGroups as typeof settingsGroups).map((group) => (
            <View key={group.title} className="mb-6">
              <Text className="font-bold text-lg text-[#1a2e1f] mb-3">{group.title}</Text>
              <View className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                {group.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={item.onClick}
                    disabled={item.disabled}
                    className={`flex-row items-center gap-4 p-4 ${
                      index < group.items.length - 1 ? "border-b border-[#e5e7eb]" : ""
                    } ${item.disabled ? "opacity-50" : ""}`}
                  >
                    <View className="w-10 h-10 items-center justify-center rounded-xl bg-[#16a34a]/10">
                      <Ionicons name={item.icon} size={20} color="#16a34a" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-sm text-[#1a2e1f]">{item.label}</Text>
                      {item.description && <Text className="text-xs text-[#657c69] mt-0.5">{item.description}</Text>}
                    </View>
                    {item.hasSwitch ? (
                      <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitchChange}
                        disabled={item.disabled}
                        trackColor={{ false: "#e5e7eb", true: "#16a34a" }}
                        thumbColor="#ffffff"
                      />
                    ) : item.value ? (
                      <Text className="text-sm text-[#657c69]">{item.value}</Text>
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#657c69" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Auth Action */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={isGuest ? () => router.push("/(auth)/login") : handleLogout}
              className={`bg-white rounded-2xl p-4 flex-row items-center gap-4 ${isGuest ? "border border-[#16a34a]/30" : "border border-red-200"}`}
            >
              <View
                className={`w-10 h-10 items-center justify-center rounded-xl ${isGuest ? "bg-[#16a34a]/10" : "bg-red-100"}`}
              >
                <Ionicons
                  name={isGuest ? "log-in-outline" : "log-out-outline"}
                  size={20}
                  color={isGuest ? "#16a34a" : "#ef4444"}
                />
              </View>
              <Text className={`font-medium text-sm flex-1 ${isGuest ? "text-[#16a34a]" : "text-red-600"}`}>
                {isGuest ? "Log in" : "Log Out"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="items-center pb-4">
            <Text className="text-xs text-[#657c69]">GreenPlate v1.0.0 (MVP)</Text>
            <Text className="text-xs text-[#657c69] mt-1">Made with ❤️ for Ghana</Text>
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
}
