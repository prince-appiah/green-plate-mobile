import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface DayHours {
  dayOfWeek: string;
  open: string | null;
  close: string | null;
}

interface OpeningHoursProps {
  hours: DayHours[];
  onChange: (hours: DayHours[]) => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function OpeningHours({
  hours,
  onChange,
}: OpeningHoursProps) {
  const validateTimeInput = (input: string): string => {
    // Remove any non-digit and non-colon characters
    let cleaned = input.replace(/[^\d:]/g, "");
    
    // Extract only digits
    const digitsOnly = cleaned.replace(/:/g, "");
    
    // Limit to 4 digits
    const limitedDigits = digitsOnly.substring(0, 4);
    
    if (limitedDigits.length === 0) {
      return "";
    }
    
    // Reconstruct in HH:mm format
    let hours = limitedDigits.substring(0, 2);
    let minutes = limitedDigits.substring(2);
    
    // Auto-insert colon when user types 3rd digit
    let result = hours;
    if (limitedDigits.length > 2 || (limitedDigits.length === 2 && cleaned.includes(":"))) {
      result = hours + ":" + minutes;
    }
    
    // Validate hours (00-23)
    const hoursNum = parseInt(hours, 10);
    if (!isNaN(hoursNum)) {
      if (hoursNum > 23) {
        hours = "23";
        result = "23" + (minutes ? ":" + minutes : "");
      } else if (hours.length === 2 && hours[0] === "2" && parseInt(hours[1], 10) > 3) {
        hours = "23";
        result = "23" + (minutes ? ":" + minutes : "");
      }
    }
    
    // Validate minutes (00-59)
    if (minutes) {
      const minutesNum = parseInt(minutes, 10);
      if (!isNaN(minutesNum)) {
        if (minutesNum > 59) {
          minutes = "59";
          result = hours + ":59";
        } else if (minutes.length === 1 && minutesNum > 5) {
          minutes = "5";
          result = hours + ":5";
        }
      }
    }
    
    return result;
  };

  const updateDayHours = (day: string, field: "open" | "close", value: string) => {
    const validatedValue = validateTimeInput(value);
    // Convert empty string to null
    const finalValue = validatedValue === "" ? null : validatedValue;
    const updatedHours = hours.map((dayHours) =>
      dayHours.dayOfWeek === day
        ? { ...dayHours, [field]: finalValue }
        : dayHours
    );
    onChange(updatedHours);
  };

  const toggleDayClosed = (day: string) => {
    const dayHours = hours.find((h) => h.dayOfWeek === day);
    if (dayHours) {
      if (dayHours.open === null && dayHours.close === null) {
        // Opening the day
        const updatedHours = hours.map((h) =>
          h.dayOfWeek === day
            ? { ...h, open: "09:00", close: "17:00" }
            : h
        );
        onChange(updatedHours);
      } else {
        // Closing the day - set to null
        const updatedHours = hours.map((h) =>
          h.dayOfWeek === day
            ? { ...h, open: null, close: null }
            : h
        );
        onChange(updatedHours);
      }
    }
  };

  const getDayHours = (day: string): DayHours => {
    return (
      hours.find((h) => h.dayOfWeek === day) || {
        dayOfWeek: day,
        open: null,
        close: null,
      }
    );
  };

  return (
    <View>
      {DAYS_OF_WEEK.map((day, index) => {
        const dayHours = getDayHours(day);
        const isClosed = dayHours.open === null && dayHours.close === null;

        return (
          <View
            key={day}
            className={`bg-white rounded-xl border border-[#e5e7eb] p-4 ${
              index < DAYS_OF_WEEK.length - 1 ? "mb-3" : ""
            }`}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-[#1a2e1f] flex-1">
                {day}
              </Text>
              <TouchableOpacity
                onPress={() => toggleDayClosed(day)}
                className={`px-3 py-1 rounded-full ${
                  isClosed
                    ? "bg-[#fee2e2]"
                    : "bg-[#dcfce7]"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    isClosed ? "text-[#dc2626]" : "text-[#16a34a]"
                  }`}
                >
                  {isClosed ? "Closed" : "Open"}
                </Text>
              </TouchableOpacity>
            </View>

            {!isClosed && (
              <View className="flex-row items-center">
                <View className="flex-1 mr-3">
                  <Text className="text-xs text-[#657c69] mb-1">Open</Text>
                  <View className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-3 h-10 flex-row items-center">
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color="#657c69"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      className="flex-1 text-[#1a2e1f] text-sm"
                      placeholder="09:00"
                      placeholderTextColor="#9ca3af"
                      value={dayHours.open || ""}
                      onChangeText={(value) =>
                        updateDayHours(day, "open", value)
                      }
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-xs text-[#657c69] mb-1">Close</Text>
                  <View className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-3 h-10 flex-row items-center">
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color="#657c69"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      className="flex-1 text-[#1a2e1f] text-sm"
                      placeholder="17:00"
                      placeholderTextColor="#9ca3af"
                      value={dayHours.close || ""}
                      onChangeText={(value) =>
                        updateDayHours(day, "close", value)
                      }
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

