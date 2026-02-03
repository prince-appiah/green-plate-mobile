import React from "react";
import { View } from "react-native";
import { PerformanceMetricsCard } from "./performance-metrics-card";
import { SectionHeader } from "./section-header";

export function PerformanceSection() {
  return (
    <View className="mb-6">
      <SectionHeader title="Performance" />
      <PerformanceMetricsCard />
    </View>
  );
}
