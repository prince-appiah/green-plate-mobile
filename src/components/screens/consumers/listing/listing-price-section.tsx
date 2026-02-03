import React from "react";
import { Text, View } from "react-native";

interface ListingPriceSectionProps {
  discountedPrice: string;
  originalPrice: string;
  quantityAvailable: number;
}

/**
 * Price section with discounted/original price and quantity available
 */
export function ListingPriceSection({ discountedPrice, originalPrice, quantityAvailable }: ListingPriceSectionProps) {
  return (
    <View className="bg-[rgba(220,252,231,0.3)] border border-[#dcfce7] rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-[#657c69] mb-1">Price</Text>
          <View className="flex-row items-center">
            <Text className="text-3xl font-bold text-[#16a34a] mr-3">{discountedPrice}</Text>
            <Text className="text-lg text-[#657c69] line-through">{originalPrice}</Text>
          </View>
        </View>
        <View className="bg-[rgba(22,163,74,0.1)] rounded-2xl px-4 py-2">
          <Text className="text-[#16a34a] text-sm font-bold">{quantityAvailable} left</Text>
        </View>
      </View>
    </View>
  );
}
