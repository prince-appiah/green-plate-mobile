import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface UserLocationPillProps {
  isLoading?: boolean;
  hasLocation?: boolean;
}

export default function UserLocationPill({
  isLoading = false,
  hasLocation = false,
}: UserLocationPillProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <View style={styles.pill}>
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="#16a34a" />
            <Text style={styles.text}>Getting location...</Text>
          </>
        ) : (
          <>
            <Ionicons name="location" size={16} color="#16a34a" />
            <Text style={styles.text}>
              {hasLocation ? "Your Location" : "Current Location"}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  pill: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 6,
  },
});
