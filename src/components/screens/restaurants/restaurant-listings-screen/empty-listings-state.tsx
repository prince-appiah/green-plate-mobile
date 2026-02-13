import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function EmptyListingsState() {
  return (
    <View className="flex-col items-center justify-center py-12">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
        <Ionicons name="list-outline" size={32} color="#16a34a" />
      </View>
      <Text className="font-semibold text-[#1a2e1f] mb-1 text-lg">No listings yet</Text>
      <Text className="text-sm text-[#657c69] text-center mb-4">
        Create your first listing to start selling surplus food
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(restaurants)/create-listing")}
        className="bg-[#16a34a] rounded-xl px-6 py-3"
      >
        <Text className="text-white font-semibold">Create Listing</Text>
      </TouchableOpacity>
    </View>
  );
}
