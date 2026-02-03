import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ErrorListingsStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

export function ErrorListingsState({ error, onRetry }: ErrorListingsStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <View className="w-16 h-16 items-center justify-center rounded-full bg-red-100 mb-4">
        <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
      </View>
      <Text className="font-semibold text-[#1a2e1f] mb-1 text-lg">Error loading listings</Text>
      <Text className="text-sm text-[#657c69] text-center mb-4">
        {error instanceof Error ? error.message : "Failed to load listings"}
      </Text>
      <TouchableOpacity onPress={onRetry} className="bg-[#16a34a] rounded-xl px-6 py-3">
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}
