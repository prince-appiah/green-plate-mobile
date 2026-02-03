import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface ListingTitleSectionProps {
  title: string;
  restaurantName: string;
}

/**
 * Title and restaurant information section
 */
export function ListingTitleSection({ title, restaurantName }: ListingTitleSectionProps) {
  return (
    <View className="mb-4">
      <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">{title}</Text>
      <View className="flex-row items-center">
        <Ionicons name="restaurant" size={16} color="#657c69" />
        <Text className="text-[#657c69] text-base ml-2">{restaurantName}</Text>
      </View>
    </View>
  );
}
