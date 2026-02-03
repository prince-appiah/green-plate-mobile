import { formatCurrency } from "@/features/shared";
import React from "react";
import { Text, View } from "react-native";

interface PriceSummaryProps {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function PriceSummary({ quantity, unitPrice, totalPrice }: PriceSummaryProps) {
  return (
    <View className="mb-6 bg-[rgba(220,252,231,0.3)] rounded-2xl p-4 border border-[#dcfce7]">
      <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Price Summary</Text>
      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-[#657c69]">
            {quantity} × {formatCurrency(unitPrice)}
          </Text>
          <Text className="text-[#657c69]">{formatCurrency(unitPrice * quantity)}</Text>
        </View>
        <View className="border-t border-[#dcfce7] pt-2 mt-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-[#1a2e1f]">Total</Text>
            <Text className="text-2xl font-bold text-[#16a34a]">{formatCurrency(totalPrice)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
