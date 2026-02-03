import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import {
  AnalyticsHeader,
  ImpactSection,
  OverviewSection,
  PerformanceSection,
} from "@/components/screens/restaurants/restaurant-analytics-screen";
import { useGetRestaurantStats, useGetRestaurantStatsSuspense } from "@/features/restaurants";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestaurantAnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);

  const { isPending, refetch } = useGetRestaurantStats();
  const analytics = useGetRestaurantStatsSuspense();
  const { totalMealsSaved, totalCo2PreventedKg } = analytics.data.data;

  return (
    <CustomSafeAreaView useSafeArea>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
      >
        <AnalyticsHeader title="Analytics" subtitle="Track your restaurant's performance" />

        <OverviewSection />

        <ImpactSection mealsSaved={totalMealsSaved} co2PreventedKg={totalCo2PreventedKg} />

        <PerformanceSection />
      </ScrollView>
    </CustomSafeAreaView>
  );
}
