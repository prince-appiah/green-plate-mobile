import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export function LoadingListingsState() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#16a34a" />
      <Text className="text-sm text-[#657c69] mt-4">Loading listings...</Text>
    </View>
  );
}
