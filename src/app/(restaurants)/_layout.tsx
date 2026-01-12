import { Tabs } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";

export default function RestaurantTabsLayout() {
  const insets = useSafeAreaInsets();

  // Calculate tab bar height with proper safe area handling for both iOS and Android
  const tabBarPaddingBottom = Math.max(
    insets.bottom,
    Platform.OS === "android" ? 8 : 10,
  );
  const tabBarHeight = 60 + tabBarPaddingBottom;

  return (
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
          title: "Listings",
          tabBarLabel: "Listings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-check" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size || 24} color={color} />
          ),
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
        name="create-listing"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

