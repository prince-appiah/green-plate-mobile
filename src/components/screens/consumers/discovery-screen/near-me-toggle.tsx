import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NearMeToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  hasPermission?: boolean;
  isLoading?: boolean;
}

/**
 * Near Me toggle button for map view
 * Allows users to enable location-based filtering
 */
export function NearMeToggle({ isEnabled, onToggle, hasPermission, isLoading }: NearMeToggleProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 60,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        disabled={isLoading}
        style={[styles.button, isEnabled && styles.buttonEnabled, isLoading && styles.buttonDisabled]}
      >
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color={isEnabled ? "#ffffff" : "#16a34a"} />
            <Text style={[styles.text, isEnabled && styles.textEnabled, { marginLeft: 6 }]}>Getting location...</Text>
          </>
        ) : (
          <>
            <Ionicons
              name={isEnabled ? "location" : "location-outline"}
              size={16}
              color={isEnabled ? "#ffffff" : "#16a34a"}
            />
            <Text style={[styles.text, isEnabled && styles.textEnabled]}>Show listings near me</Text>
          </>
        )}
      </TouchableOpacity>
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
  button: {
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
  buttonEnabled: {
    backgroundColor: "#16a34a",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 6,
  },
  textEnabled: {
    color: "#ffffff",
  },
});
