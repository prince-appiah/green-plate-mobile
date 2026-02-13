import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function PerformanceMetricsCard() {
  return (
    <View className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-sm">
      <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-[#e5e7eb]">
        <View className="flex-row items-center">
          <Ionicons name="star" size={20} color="#f59e0b" />
          <Text className="text-base font-semibold text-[#1a2e1f] ml-2">Average Rating</Text>
        </View>
        <Text className="text-xl font-bold text-[#1a2e1f]">0</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-[#657c69]">Total Reviews</Text>
        <Text className="text-base font-semibold text-[#1a2e1f]">0</Text>
      </View>
    </View>
  );
}
