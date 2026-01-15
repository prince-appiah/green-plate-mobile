import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/auth-store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { tokenStorage } from "@/lib/token-storage";
import { router } from "expo-router";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGoogleSignin } from "@/features/auth";

type SettingsView = "main" | "payment";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const [currentView, setCurrentView] = useState<SettingsView>("main");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { handleLogout } = useGoogleSignin();

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
          disabled: false,
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
          icon: "card-outline" as const,
          label: "Payment Methods",
          description: "Visa •••• 4242",
          disabled: false,
          hasSwitch: false,
          value: null,
          switchChange: false,
          onSwitchChange: () => {},
          onClick: () => setCurrentView("payment"),
        },
        {
          icon: "shield-checkmark-outline" as const,
          label: "Privacy & Security",
          disabled: false,
          hasSwitch: false,
          value: null,
          switchChange: false,
          onSwitchChange: () => {},
          onClick: () => {},
        },
        {
          icon: "refresh-outline" as const,
          label: "Reset Onboarding",
          description: "Start fresh",
          disabled: false,
          hasSwitch: false,
          switchValue: false,
          switchChange: false,
          value: null,
          onSwitchChange: () => {},
          onClick: () => {},
        },
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
          {settingsGroups.map((group) => (
            <View key={group.title} className="mb-6">
              <Text className="font-bold text-lg text-[#1a2e1f] mb-3">
                {group.title}
              </Text>
              <View className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                {group.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={item.onClick}
                    disabled={item.disabled}
                    className={`flex-row items-center gap-4 p-4 ${
                      index < group.items.length - 1
                        ? "border-b border-[#e5e7eb]"
                        : ""
                    } ${item.disabled ? "opacity-50" : ""}`}
                  >
                    <View className="w-10 h-10 items-center justify-center rounded-xl bg-[#16a34a]/10">
                      <Ionicons name={item.icon} size={20} color="#16a34a" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-sm text-[#1a2e1f]">
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text className="text-xs text-[#657c69] mt-0.5">
                          {item.description}
                        </Text>
                      )}
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
                      <Text className="text-sm text-[#657c69]">
                        {item.value}
                      </Text>
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#657c69"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white rounded-2xl p-4 border border-red-200 flex-row items-center gap-4"
            >
              <View className="w-10 h-10 items-center justify-center rounded-xl bg-red-100">
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              </View>
              <Text className="font-medium text-sm text-red-600 flex-1">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="items-center pb-4">
            <Text className="text-xs text-[#657c69]">
              GreenPlate v1.0.0 (MVP)
            </Text>
            <Text className="text-xs text-[#657c69] mt-1">
              Made with 💚 for the planet
            </Text>
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
}
