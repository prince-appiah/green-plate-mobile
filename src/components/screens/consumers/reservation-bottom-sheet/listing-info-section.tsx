import { formatCurrency } from "@/features/shared";
import React from "react";
import { Text, View } from "react-native";

interface ListingInfoSectionProps {
  title: string;
  unitPrice: number;
  quantityAvailable: number;
}

export function ListingInfoSection({ title, unitPrice, quantityAvailable }: ListingInfoSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">{title}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-base text-[#657c69]">{formatCurrency(unitPrice)} per item</Text>
        <View className="bg-[rgba(22,163,74,0.1)] rounded-xl px-3 py-1">
          <Text className="text-[#16a34a] text-sm font-semibold">{quantityAvailable} available</Text>
        </View>
      </View>
    </View>
  );
}
