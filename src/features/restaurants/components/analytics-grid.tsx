import { formatCurrency } from "@/features/shared/utils/helpers";
import React from "react";
import { View } from "react-native";
import { useGetRestaurantStatsSuspense } from "../hooks/use-restaurants";
import { AnalyticsCard } from "./analytics-card";

export const AnalyticsGrid = () => {
  const { data } = useGetRestaurantStatsSuspense();
  const analytics = data.data;

  return (
    <View className="flex-row flex-wrap -mx-1">
      <View className="w-1/2 px-1 mb-3">
        <AnalyticsCard
          icon="cash"
          label="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          color="#16a34a"
        />
      </View>
      <View className="w-1/2 px-1 mb-3">
        <AnalyticsCard
          icon="list"
          label="Total Listings"
          value={analytics.totalListings}
          color="#3b82f6"
        />
      </View>
      <View className="w-1/2 px-1 mb-3">
        <AnalyticsCard
          icon="bag-check"
          label="Total Orders"
          value={analytics.totalReservations}
          color="#f59e0b"
        />
      </View>
      {/* <View className="w-1/2 px-1 mb-3">
      <AnalyticsCard
        icon="flame"
        label="Active Listings"
        value={analytics.}
        color="#ef4444"
      />
    </View> */}
    </View>
  );
};
