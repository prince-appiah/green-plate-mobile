import React from "react";
import { Text, View } from "react-native";

interface BookingsHeaderProps {
  filteredCount: number;
  selectedStatus: string;
}

/**
 * Header section with bookings title and count
 */
export function BookingsHeader({ filteredCount, selectedStatus }: BookingsHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-2xl font-bold text-[#1a2e1f]">Bookings</Text>
      {selectedStatus !== "all" && (
        <Text className="text-sm text-[#657c69]">
          {filteredCount} {filteredCount === 1 ? "booking" : "bookings"}
        </Text>
      )}
    </View>
  );
}
