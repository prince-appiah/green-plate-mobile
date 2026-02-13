import { Typography } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
  onBlur?: () => void;
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

const CATEGORIES = [
  { value: "prepared", label: "Prepared" },
  { value: "packaged", label: "Packaged" },
  { value: "fresh", label: "Fresh" },
  { value: "bulk", label: "Bulk" },
] as const;

// Helper to get display label from API value
const getCategoryLabel = (value: string): string => {
  const category = CATEGORIES.find((cat) => cat.value === value);
  return category?.label || value;
};

export const CategoryPicker = ({
  value,
  onChange,
  onBlur,
  required = false,
  label,
  error,
  className,
}: CategoryPickerProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (category: string) => {
    onChange(category);
    onBlur?.();
    setShowModal(false);
  };

  return (
    <View className={cn("mb-4", className)}>
      {label && (
        <Typography className="text-sm  font-medium mb-2">
          {label}
          {required && <Typography className="text-red-500">*</Typography>}
        </Typography>
      )}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className={`bg-[#f9fafb] rounded-lg border px-4 py-3 flex-row items-center justify-between ${
          error ? "border-red-500" : "border-[#e5e7eb]"
        }`}
      >
        <Typography className={`flex-1 text-base ${value ? "text-[#1a2e1f]" : "text-[#9ca3af]"}`}>
          {value ? getCategoryLabel(value) : "Select category"}
        </Typography>
        <Ionicons name="chevron-down" size={20} color="#657c69" />
      </TouchableOpacity>
      {error && <Typography className="mt-1 text-sm text-red-500">{error}</Typography>}

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-[#e5e7eb]">
              <Typography className="text-lg font-semibold text-[#1a2e1f]">Select Category</Typography>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#657c69" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  onPress={() => handleSelect(category.value)}
                  className="py-4 border-b border-[#e5e7eb] flex-row items-center justify-between"
                >
                  <Typography className="text-base text-[#1a2e1f]">{category.label}</Typography>
                  {value === category.value && <Ionicons name="checkmark" size={20} color="#16a34a" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
