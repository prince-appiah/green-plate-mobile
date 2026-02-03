import { AnalyticsGrid } from "@/features/restaurants";
import React, { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { SectionHeader } from "./section-header";

export function OverviewSection() {
  return (
    <View className="mb-6">
      <SectionHeader title="Overview" />
      <Suspense fallback={<ActivityIndicator />}>
        <AnalyticsGrid />
      </Suspense>
    </View>
  );
}
