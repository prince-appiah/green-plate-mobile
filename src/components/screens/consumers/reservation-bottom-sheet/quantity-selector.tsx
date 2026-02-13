import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  canIncrement: boolean;
  canDecrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantitySelector({
  quantity,
  maxQuantity,
  canIncrement,
  canDecrement,
  onIncrement,
  onDecrement,
}: QuantitySelectorProps) {
  return (
    <View className="mb-6">
      <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Quantity</Text>
      <View className="flex-row items-center justify-between bg-[rgba(220,252,231,0.3)] rounded-2xl p-4 border border-[#dcfce7]">
        <TouchableOpacity
          onPress={onDecrement}
          disabled={!canDecrement}
          className={`w-10 h-10 items-center justify-center rounded-full ${
            canDecrement ? "bg-[#16a34a]" : "bg-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={20} color={canDecrement ? "#ffffff" : "#9CA3AF"} />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-3xl font-bold text-[#1a2e1f]">{quantity}</Text>
          <Text className="text-sm text-[#657c69] mt-1">Max: {maxQuantity}</Text>
        </View>

        <TouchableOpacity
          onPress={onIncrement}
          disabled={!canIncrement}
          className={`w-10 h-10 items-center justify-center rounded-full ${
            canIncrement ? "bg-[#16a34a]" : "bg-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={canIncrement ? "#ffffff" : "#9CA3AF"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
