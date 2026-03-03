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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);

  const {
    allReservations,
    filteredReservations,
    selectedStatus,
    setSelectedStatus: setStatusRaw,
    isGuest,
    isPending,
    error,
    refetch,
    handleReservationPress,
    handleBrowseListings,
    statusFilterOptions,
  } = useBookingsList();

  const setSelectedStatus = (status: string) => setStatusRaw(status as any);

  if (isGuest) {
    return (
      <CustomSafeAreaView useSafeArea>
        <View>
          <BookingsHeader filteredCount={0} selectedStatus={selectedStatus} />

          <BookingsStatusFilter
            options={statusFilterOptions as StatusFilterOption[]}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />

          <View className="flex-col items-center justify-center py-12 px-6">
            <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
              <Ionicons name="bag-outline" size={32} color="#16a34a" />
            </View>
            <Text className="font-semibold text-[#1a2e1f] mb-2 text-lg text-center">
              Bookings are for logged-in users
            </Text>
            <Text className="text-sm text-[#657c69] text-center mb-6">
              Log in to view and manage your personal reservations.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              className="bg-[#16a34a] rounded-xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomSafeAreaView>
    );
  }

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
