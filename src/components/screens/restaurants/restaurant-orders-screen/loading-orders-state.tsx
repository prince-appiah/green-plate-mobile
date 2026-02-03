import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export function LoadingOrdersState() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#16a34a" />
      <Text className="text-sm text-[#657c69] mt-4">Loading orders...</Text>
    </View>
  );
}
