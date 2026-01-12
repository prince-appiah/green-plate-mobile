import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ViewToggleProps {
  viewMode: "list" | "map";
  onToggle: (mode: "list" | "map") => void;
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <View className="bg-[#e5e7eb] rounded-xl p-1 flex-row">
      <TouchableOpacity
        onPress={() => onToggle("list")}
        className={`flex-row items-center gap-2 px-4 py-2 rounded-lg ${
          viewMode === "list" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Ionicons name="list-outline" size={16} color={viewMode === "list" ? "#1a2e1f" : "#657c69"} />
        <Text className={`text-sm font-medium ${viewMode === "list" ? "text-[#1a2e1f]" : "text-[#657c69]"}`}>List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled
        onPress={() => onToggle("map")}
        className={`flex-row items-center gap-2 px-4 py-2 rounded-lg ${viewMode === "map" ? "bg-white shadow-sm" : ""}`}
      >
        <Ionicons name="map-outline" size={16} color={viewMode === "map" ? "#1a2e1f" : "#657c69"} />
        <Text className={`text-sm font-medium ${viewMode === "map" ? "text-[#1a2e1f]" : "text-[#657c69]"}`}>Map</Text>
      </TouchableOpacity>
    </View>
  );
}
