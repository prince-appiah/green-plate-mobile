import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export interface StatusFilterOption {
  label: string;
  value: string;
}

interface BookingsStatusFilterProps {
  options: StatusFilterOption[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

/**
 * Status filter tabs for bookings screen
 * Shows all available booking statuses for filtering
 */
export function BookingsStatusFilter({ options, selectedStatus, onStatusChange }: BookingsStatusFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6 min-h-12"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {options.map(({ label, value }) => (
        <TouchableOpacity
          key={value}
          onPress={() => onStatusChange(value)}
          className={`h-9 px-4 flex items-center justify-center rounded-full mr-2 ${
            selectedStatus === value ? "bg-[#16a34a]" : "bg-white border border-[#e5e7eb]"
          }`}
        >
          <Text
            className={`text-xs self-center text-center ${
              selectedStatus === value ? "text-white font-semibold" : "text-[#1a2e1f] font-medium"
            }`}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
