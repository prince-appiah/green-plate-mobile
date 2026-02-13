import {
  BookingsEmptyState,
  BookingsErrorState,
  BookingsHeader,
  BookingsListContent,
  BookingsStatusFilter,
  type StatusFilterOption,
} from "@/components/screens/consumers/bookings-list";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useBookingsList } from "@/features/reservations";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);

  const {
    allReservations,
    filteredReservations,
    selectedStatus,
    setSelectedStatus: setStatusRaw,
    isPending,
    error,
    refetch,
    handleReservationPress,
    handleBrowseListings,
    statusFilterOptions,
  } = useBookingsList();

  // Type coercion for status setter
  const setSelectedStatus = (status: string) => setStatusRaw(status as any);

  if (isPending && allReservations.length === 0) {
    return (
      <CustomSafeAreaView useSafeArea>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-sm text-[#657c69] mt-4">Loading bookings...</Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (error) {
    return (
      <CustomSafeAreaView useSafeArea>
        <BookingsErrorState onRetry={() => refetch()} />
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView useSafeArea>
      <View className="">
        <BookingsHeader filteredCount={filteredReservations.length} selectedStatus={selectedStatus} />

        {/* Status Filter */}
        <BookingsStatusFilter
          options={statusFilterOptions as StatusFilterOption[]}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* Reservations List or Empty State */}
        {filteredReservations.length > 0 ? (
          <BookingsListContent
            reservations={filteredReservations}
            isPending={isPending}
            tabBarHeight={tabBarHeight}
            onRefresh={refetch}
            onReservationPress={handleReservationPress}
          />
        ) : (
          <BookingsEmptyState status={selectedStatus} onBrowsePress={handleBrowseListings} />
        )}
      </View>
    </CustomSafeAreaView>
  );
}
