import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface TimeInputProps {
  value: string; // Format: "HH:mm"
  onChange: (time: string) => void;
  placeholder?: string;
  label?: string;
}

const parseTimeToDate = (timeString: string): Date => {
  const date = new Date();
  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    date.setHours(hours || 9);
    date.setMinutes(minutes || 0);
  } else {
    date.setHours(9);
    date.setMinutes(0);
  }
  return date;
};

export default function TimeInput({
  value,
  onChange,
  placeholder = "Select time",
  label,
}: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(() => parseTimeToDate(value));

  // Update tempDate when value changes
  useEffect(() => {
    setTempDate(parseTimeToDate(value));
  }, [value]);

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) {
        const timeString = formatTime(selectedDate);
        onChange(timeString);
      }
    } else {
      // iOS
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleIOSConfirm = () => {
    const timeString = formatTime(tempDate);
    onChange(timeString);
    setShowPicker(false);
  };

  const handleIOSCancel = () => {
    setShowPicker(false);
  };

  const displayValue = value || placeholder;

  return (
    <View>
      {label && (
        <Text className="text-xs text-[#657c69] mb-1">{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => {
          setTempDate(parseTimeToDate(value));
          setShowPicker(true);
        }}
        className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-3 h-10 flex-row items-center"
      >
        <Ionicons
          name="time-outline"
          size={16}
          color="#657c69"
          style={{ marginRight: 8 }}
        />
        <Text
          className={`flex-1 text-sm ${
            value ? "text-[#1a2e1f]" : "text-[#9ca3af]"
          }`}
        >
          {displayValue}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}

      {Platform.OS === "ios" && showPicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={handleIOSCancel}>
                  <Text className="text-[#657c69] text-base">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-[#1a2e1f] font-semibold text-base">
                  Select Time
                </Text>
                <TouchableOpacity onPress={handleIOSConfirm}>
                  <Text className="text-[#16a34a] font-semibold text-base">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="time"
                is24Hour={true}
                onChange={handleTimeChange}
                display="spinner"
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

