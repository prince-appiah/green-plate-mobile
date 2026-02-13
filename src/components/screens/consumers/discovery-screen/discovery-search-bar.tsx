import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface DiscoverySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterPress?: () => void;
}

/**
 * Search bar component for discovery screen
 * Includes search input and filter button
 */
export function DiscoverySearchBar({ searchQuery, onSearchChange, onFilterPress }: DiscoverySearchBarProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="relative flex-1">
        <Ionicons
          name="search"
          size={16}
          color="#657c69"
          style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
        />
        <TextInput
          placeholder="Search restaurants or food..."
          placeholderTextColor="#657c69"
          value={searchQuery}
          onChangeText={onSearchChange}
          className="w-full rounded-xl border border-[#e5e7eb] bg-white py-3 pl-10 pr-4 text-sm text-[#1a2e1f]"
          style={{ fontSize: 14 }}
        />
      </View>
      <TouchableOpacity
        onPress={onFilterPress}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white"
      >
        <Ionicons name="options-outline" size={20} color="#657c69" />
      </TouchableOpacity>
    </View>
  );
}
