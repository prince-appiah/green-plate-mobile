import React from "react";
import { Text, View } from "react-native";

interface ListingDescriptionCardProps {
  description: string;
}

interface ListingCategoryCardProps {
  category: string;
}

interface ListingRestaurantCardProps {
  restaurantName: string;
  description?: string;
}

/**
 * Description information card
 */
export function ListingDescriptionCard({ description }: ListingDescriptionCardProps) {
  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">Description</Text>
      <Text className="text-[#657c69] text-base leading-6">{description}</Text>
    </View>
  );
}

/**
 * Category badge card
 */
export function ListingCategoryCard({ category }: ListingCategoryCardProps) {
  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">Category</Text>
      <View className="bg-[rgba(220,252,231,0.4)] rounded-2xl px-4 py-2 self-start">
        <Text className="text-[#14532d] text-sm font-medium capitalize">{category}</Text>
      </View>
    </View>
  );
}

/**
 * Restaurant information card
 */
export function ListingRestaurantCard({ restaurantName, description }: ListingRestaurantCardProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">Restaurant Information</Text>
      <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4">
        <Text className="text-base font-semibold text-[#1a2e1f] mb-2">{restaurantName}</Text>
        {description && <Text className="text-sm text-[#657c69] mb-3">{description}</Text>}
        {/* TODO: Add rating display when available in API response */}
        {/* TODO: Add reviews display when available in API response */}
      </View>
    </View>
  );
}
