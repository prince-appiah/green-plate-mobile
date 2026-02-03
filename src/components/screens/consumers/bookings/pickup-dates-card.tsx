import { Typography } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { View } from "react-native";

interface PickupDatesCardProps {
  reservationDate: Date | string;
  pickupTimeRange: string;
  pickupInstructions?: string;
}

export function PickupDatesCard({ reservationDate, pickupTimeRange, pickupInstructions }: PickupDatesCardProps) {
  return (
    <View className="mb-4">
      <Typography className="text-lg font-semibold text-[#1a2e1f] mb-3">Important Dates</Typography>
      <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
        <View className="flex-row items-start">
          <Ionicons name="calendar-outline" size={20} color="#16a34a" style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <Typography className="text-sm text-[#657c69] mb-1">Reservation Date</Typography>
            <Typography className="text-[#1a2e1f]">{format(new Date(reservationDate), "MMMM dd, yyyy")}</Typography>
          </View>
        </View>
        <View className="flex-row items-start">
          <Ionicons name="time-outline" size={20} color="#16a34a" style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <Typography className="text-sm text-[#657c69] mb-1">Pickup Time</Typography>
            <Typography className="text-[#1a2e1f]">{pickupTimeRange}</Typography>
            {pickupInstructions && (
              <Typography className="text-sm text-[#657c69] mt-1">{pickupInstructions}</Typography>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
