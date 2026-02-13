import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BookingsEmptyStateProps {
  status: "all" | string;
  onBrowsePress: () => void;
}

/**
 * Empty state component for bookings list
 * Shows different messages based on filter status
 */
export function BookingsEmptyState({ status, onBrowsePress }: BookingsEmptyStateProps) {
  const isAllStatus = status === "all";

  return (
    <View className="flex-col items-center justify-center py-12">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
        <Ionicons name="bag-outline" size={32} color="#16a34a" />
      </View>
      <Text className="font-semibold text-[#1a2e1f] mb-2 text-lg">
        {isAllStatus ? "No bookings yet" : `No ${status} bookings`}
      </Text>
      <Text className="text-sm text-[#657c69] text-center mb-6">
        {isAllStatus
          ? "Start saving food and reducing waste by making your first reservation!"
          : `You don't have any ${status} reservations at the moment.`}
      </Text>
      {isAllStatus && (
        <TouchableOpacity onPress={onBrowsePress} className="bg-[#16a34a] rounded-xl px-6 py-3">
          <Text className="text-white font-semibold">Browse Listings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
