import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BookingsErrorStateProps {
  onRetry: () => void;
}

/**
 * Error state component for bookings list
 * Shows error message and retry button
 */
export function BookingsErrorState({ onRetry }: BookingsErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <View className="w-14 h-14 items-center justify-center rounded-full bg-red-100 mb-3">
        <Ionicons name="alert-circle-outline" size={28} color="#ef4444" />
      </View>
      <Text className="font-semibold text-[#1a2e1f] mb-1 text-center">Failed to load bookings</Text>
      <Text className="text-sm text-[#657c69] text-center mb-4">Please try again later</Text>
      <TouchableOpacity onPress={onRetry} className="bg-[#16a34a] rounded-xl px-6 py-3">
        <Text className="text-white font-semibold">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
