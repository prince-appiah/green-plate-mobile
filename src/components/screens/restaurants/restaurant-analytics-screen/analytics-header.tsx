import React from "react";
import { Text, View } from "react-native";

interface AnalyticsHeaderProps {
  title: string;
  subtitle: string;
}

export function AnalyticsHeader({ title, subtitle }: AnalyticsHeaderProps) {
  return (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">{title}</Text>
      <Text className="text-sm text-[#657c69]">{subtitle}</Text>
    </View>
  );
}
