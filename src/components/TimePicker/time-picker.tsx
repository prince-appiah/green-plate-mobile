import { Typography } from "@/components/ui/text";
import { formatTime12Hour, formatTime24Hour, parseTimeToDate } from "@/features/shared";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";

interface TimePickerProps {
  value: string; // Format: "HH:mm"
  onChange: (time: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
}

export const TimePicker = ({
  value,
  onChange,
  onBlur,
  placeholder = "Select time",
  label,
  className,
  required = false,
  error,
}: TimePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(() => parseTimeToDate(value));

  useEffect(() => {
    setTempDate(parseTimeToDate(value));
  }, [value]);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) {
        const timeString = formatTime24Hour(selectedDate);
        onChange(timeString);
        onBlur?.();
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleIOSConfirm = () => {
    const timeString = formatTime24Hour(tempDate);
    onChange(timeString);
    onBlur?.();
    setShowPicker(false);
  };

  const handleIOSCancel = () => {
    setShowPicker(false);
  };

  const displayValue = value ? formatTime12Hour(value) : placeholder;

  return (
    <View className={cn("mb-4", className)}>
      {label && (
        <Typography className="text-sm  font-medium mb-2">
          {label}
          {required && <Typography className="text-red-500"> *</Typography>}
        </Typography>
      )}
      <TouchableOpacity
        onPress={() => {
          setTempDate(parseTimeToDate(value));
          setShowPicker(true);
        }}
        className={cn(
          "bg-[#f9fafb] rounded-lg border px-4 py-3 flex-row items-center",
          error ? "border-red-500" : "border-[#e5e7eb]",
        )}
      >
        <Ionicons name="time-outline" size={20} color="#657c69" style={{ marginRight: 8 }} />
        <Typography className={cn("flex-1 text-base", value ? "text-[#1a2e1f]" : "text-[#9ca3af]")}>
          {displayValue}
        </Typography>
      </TouchableOpacity>
      {error && <Typography className="mt-1 text-sm text-red-500">{error}</Typography>}

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker value={tempDate} mode="time" is24Hour={true} onChange={handleTimeChange} />
      )}

      {Platform.OS === "ios" && showPicker && (
        <Modal transparent animationType="slide" visible={showPicker} onRequestClose={() => setShowPicker(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={handleIOSCancel}>
                  <Typography className="text-[#657c69] text-base">Cancel</Typography>
                </TouchableOpacity>
                <Typography className="text-[#1a2e1f] font-semibold text-base">Select Time</Typography>
                <TouchableOpacity onPress={handleIOSConfirm}>
                  <Typography className="text-[#16a34a] font-semibold text-base">Done</Typography>
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
};
