import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingGuard } from "@/features/shared";

export default function ConsumerTabsLayout() {
  const insets = useSafeAreaInsets();

  // Calculate tab bar height with proper safe area handling for both iOS and Android
  const tabBarPaddingBottom = Math.max(
    insets.bottom,
    Platform.OS === "android" ? 8 : 10
  );
  const tabBarHeight = 60 + tabBarPaddingBottom;

  return (
    // <OnboardingGuard>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#657c69",
        tabBarStyle: {
          backgroundColor: "#eff2f0",
          borderTopColor: "#e2e8f0",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: tabBarPaddingBottom,
          height: tabBarHeight,
          elevation: Platform.OS === "android" ? 8 : 0,
          shadowColor: Platform.OS === "ios" ? "#000" : undefined,
          shadowOffset:
            Platform.OS === "ios" ? { width: 0, height: -2 } : undefined,
          shadowOpacity: Platform.OS === "ios" ? 0.1 : undefined,
          shadowRadius: Platform.OS === "ios" ? 4 : undefined,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size || 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="listing/[id]"
        options={{
          href: null, // Hide from tab bar
          // tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarLabel: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings/[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
    // </OnboardingGuard>
  );
}
