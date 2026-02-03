import React from "react";
import { View } from "react-native";
import { CategoryFilters } from "./category-filters";
import { ViewToggle } from "./view-toggle";

interface DiscoveryCategoryFilterBarProps {
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  categories: Array<{ label: string; value: string }>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

/**
 * Category filter bar component
 * Shows view toggle and category filters (list mode only)
 */
export function DiscoveryCategoryFilterBar({
  viewMode,
  onViewModeChange,
  categories,
  selectedCategory,
  onCategorySelect,
}: DiscoveryCategoryFilterBarProps) {
  return (
    <View className="flex justify-center flex-row items-center mt-6">
      <ViewToggle viewMode={viewMode} onToggle={onViewModeChange} />

      {viewMode === "list" && (
        <View className="flex-1">
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onCategorySelect}
          />
        </View>
      )}
    </View>
  );
}
