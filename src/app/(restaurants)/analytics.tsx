import ImpactCard from "@/components/ImpactCard";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import {
  AnalyticsGrid,
  useGetRestaurantStats,
  useGetRestaurantStatsSuspense,
} from "@/features/restaurants";
import { Ionicons } from "@expo/vector-icons";
import React, { Suspense } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
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
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">
            Analytics
          </Text>
          <Text className="text-sm text-[#657c69]">
            Track your restaurant's performance
          </Text>
        </View>

        {/* Overview Cards */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#1a2e1f] mb-3">
            Overview
          </Text>
          <Suspense fallback={<ActivityIndicator />}>
            <AnalyticsGrid />
          </Suspense>
        </View>

        {/* Impact Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#1a2e1f] mb-3">
            Environmental Impact
          </Text>

          <ImpactCard
            mealsSaved={totalMealsSaved}
            co2PreventedKg={totalCo2PreventedKg}
          />
        </View>

        {/* Performance Metrics */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#1a2e1f] mb-3">
            Performance
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-sm">
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-[#e5e7eb]">
              <View className="flex-row items-center">
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text className="text-base font-semibold text-[#1a2e1f] ml-2">
                  Average Rating
                </Text>
              </View>
              <Text className="text-xl font-bold text-[#1a2e1f]">0</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-[#657c69]">Total Reviews</Text>
              <Text className="text-base font-semibold text-[#1a2e1f]">0</Text>
            </View>
          </View>
        </View>

        {/* Time Period Stats */}
        {/* <View className="mb-6">
          <Text className="text-lg font-bold text-[#1a2e1f] mb-3">
            This Week
          </Text>
          <View className="flex-row flex-wrap -mx-1">
            <View className="w-1/2 px-1 mb-3">
              <AnalyticsCard
                icon="trending-up"
                label="Revenue"
                value={formatCurrency(0)}
                color="#16a34a"
              />
            </View>
            <View className="w-1/2 px-1 mb-3">
              <AnalyticsCard
                icon="bag"
                label="Orders"
                value={0}
                color="#3b82f6"
              />
            </View>
          </View>
        </View> */}

        {/* <View className="mb-6">
          <Text className="text-lg font-bold text-[#1a2e1f] mb-3">
            This Month
          </Text>
          <View className="flex-row flex-wrap -mx-1">
            <View className="w-1/2 px-1 mb-3">
              <AnalyticsCard
                icon="trending-up"
                label="Revenue"
                value={formatCurrency(0)}
                color="#16a34a"
              />
            </View>
            <View className="w-1/2 px-1 mb-3">
              <AnalyticsCard
                icon="bag"
                label="Orders"
                value={0}
                color="#3b82f6"
              />
            </View>
          </View>
        </View> */}
      </ScrollView>
    </CustomSafeAreaView>
  );
}
