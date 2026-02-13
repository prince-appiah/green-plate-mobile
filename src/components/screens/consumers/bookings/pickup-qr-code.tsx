import React from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface PickupQRCodeProps {
  pickupCode: string;
}

export function PickupQRCode({ pickupCode }: PickupQRCodeProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">Pickup Code</Text>
      <View className="bg-white border border-[#e5e7eb] rounded-2xl p-6 items-center">
        <Text className="text-sm text-[#657c69] mb-4 text-center">
          Show this QR code to the restaurant to complete your pickup
        </Text>
        {/* QR Code Container */}
        <View className="bg-white p-4 rounded-2xl border-2 border-[#16a34a] mb-4">
          <QRCode value={pickupCode} size={200} backgroundColor="white" color="#1a2e1f" />
        </View>
        {/* Pickup Code Text */}
        <View className="bg-[rgba(220,252,231,0.3)] rounded-xl px-6 py-3 border border-[#dcfce7]">
          <Text className="text-xs text-[#657c69] mb-1 text-center">Pickup Code</Text>
          <Text className="text-2xl font-bold text-[#16a34a] text-center tracking-widest">{pickupCode}</Text>
        </View>
        <Text className="text-xs text-[#657c69] mt-4 text-center">
          The restaurant will scan this code to verify your pickup
        </Text>
      </View>
    </View>
  );
}
