import { formatTimeRange } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface PickupInfoSectionProps {
  startTime: string | Date;
  endTime: string | Date;
  instructions?: string;
}

export function PickupInfoSection({ startTime, endTime, instructions }: PickupInfoSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Pickup Information</Text>
      <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4">
        <View className="flex-row items-start mb-3">
          <Ionicons name="time-outline" size={20} color="#16a34a" style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-sm text-[#657c69] mb-1">Pickup Time</Text>
            <Text className="text-base font-semibold text-[#1a2e1f]">
              {formatTimeRange(
                typeof startTime === "string" ? startTime : startTime.toISOString(),
                typeof endTime === "string" ? endTime : endTime.toISOString(),
              )}
            </Text>
          </View>
        </View>
        {instructions && (
          <View className="flex-row items-start">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#16a34a"
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View className="flex-1">
              <Text className="text-sm text-[#657c69] mb-1">Instructions</Text>
              <Text className="text-base text-[#1a2e1f]">{instructions}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
