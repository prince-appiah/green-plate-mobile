import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ListingReserveButtonProps {
  onPress: () => void;
  quantityAvailable: number;
}

/**
 * Reserve now button with sold out state
 */
export function ListingReserveButton({ onPress, quantityAvailable }: ListingReserveButtonProps) {
  const isSoldOut = !quantityAvailable || quantityAvailable === 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#16a34a] rounded-2xl py-4 items-center justify-center shadow-lg"
      activeOpacity={0.8}
      disabled={isSoldOut}
    >
      <Text className="text-white text-lg font-bold">{isSoldOut ? "Sold Out" : "Reserve Now"}</Text>
    </TouchableOpacity>
  );
}
