import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function EmptyOrdersState() {
  return (
    <View className="flex-col items-center justify-center py-12">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
        <Ionicons name="bag-outline" size={32} color="#16a34a" />
      </View>
      <Text className="font-semibold text-[#1a2e1f] mb-1 text-lg">No orders yet</Text>
      <Text className="text-sm text-[#657c69] text-center">
        Orders will appear here when customers purchase your listings
      </Text>
    </View>
  );
}
