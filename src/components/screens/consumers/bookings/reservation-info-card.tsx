import { formatCurrency } from "@/features/shared";
import React from "react";
import { Text, View } from "react-native";

interface ReservationInfoCardProps {
  reservationId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function ReservationInfoCard({ reservationId, quantity, unitPrice, totalPrice }: ReservationInfoCardProps) {
  return (
    <View className="bg-[rgba(220,252,231,0.3)] border border-[#dcfce7] rounded-2xl p-4 mb-4">
      <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Reservation Information</Text>
      <View className="space-y-3">
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#657c69]">Reservation ID</Text>
          <Text className="text-sm font-semibold text-[#1a2e1f]">{reservationId.slice(0, 8)}...</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#657c69]">Quantity</Text>
          <Text className="text-sm font-semibold text-[#1a2e1f]">{quantity}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-[#657c69]">Unit Price</Text>
          <Text className="text-sm font-semibold text-[#1a2e1f]">{formatCurrency(unitPrice)}</Text>
        </View>
        <View className="border-t border-[#dcfce7] pt-3 mt-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold text-[#1a2e1f]">Total Price</Text>
            <Text className="text-2xl font-bold text-[#16a34a]">{formatCurrency(totalPrice)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
