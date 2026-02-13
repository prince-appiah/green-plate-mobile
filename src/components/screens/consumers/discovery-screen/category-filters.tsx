import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

interface CategoryFiltersProps {
  categories: { label: string; value: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

/**
 * Horizontal scrollable category filter tabs
 * Allows users to filter listings by food category
 */
export function CategoryFilters({ categories, selectedCategory, onSelectCategory }: CategoryFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {categories.map(({ label, value }) => (
        <TouchableOpacity
          key={value}
          onPress={() => onSelectCategory(value)}
          className={`h-9 px-4 flex items-center justify-center rounded-full mr-2 ${
            selectedCategory === value ? "bg-[#16a34a]" : "bg-white border border-[#e5e7eb]"
          }`}
        >
          <Text
            className={`text-xs self-center text-center ${
              selectedCategory === value ? "text-white font-semibold" : "text-[#1a2e1f] font-medium"
            }`}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
