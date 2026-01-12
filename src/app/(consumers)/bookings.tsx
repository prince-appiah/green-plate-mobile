import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ReservationCard from "@/components/ReservationCard";
import { useGetMyReservations } from "@/features/reservations";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { ReservationStatus } from "@/features/shared";

const statusFilterOptions: Array<{
  label: string;
  value: ReservationStatus | "all";
}> = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" },
  ];

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | "all">("all");

  const { data: reservationsResponse, isPending, error, refetch } = useGetMyReservations();
  const allReservations = reservationsResponse?.data || [];



  // Filter reservations based on selected status
  const filteredReservations = useMemo(() => {
    if (selectedStatus === "all") {
      return allReservations;
    }
    return allReservations.filter((r) => r.status === selectedStatus);
  }, [allReservations, selectedStatus]);

  const handleReservationPress = useCallback((reservationId: string) => {
    router.push(`/(consumers)/bookings/${reservationId}`);
  }, []);

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
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-14 h-14 items-center justify-center rounded-full bg-red-100 mb-3">
            <Ionicons name="alert-circle-outline" size={28} color="#ef4444" />
          </View>
          <Text className="font-semibold text-[#1a2e1f] mb-1 text-center">Failed to load bookings</Text>
          <Text className="text-sm text-[#657c69] text-center mb-4">Please try again later</Text>
          <TouchableOpacity onPress={() => refetch()} className="bg-[#16a34a] rounded-xl px-6 py-3">
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView useSafeArea>
      <View className="">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-[#1a2e1f]">Bookings</Text>
          {selectedStatus !== "all" && (
            <Text className="text-sm text-[#657c69]">
              {filteredReservations.length} {filteredReservations.length === 1 ? "booking" : "bookings"}
            </Text>
          )}
        </View>

        {/* Status Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6 min-h-12"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {statusFilterOptions.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              onPress={() => setSelectedStatus(value)}
              className={`h-9 px-4 flex items-center justify-center rounded-full mr-2 ${selectedStatus === value ? "bg-[#16a34a]" : "bg-white border border-[#e5e7eb]"
                }`}
            >
              <Text
                className={`text-xs self-center text-center ${selectedStatus === value ? "text-white font-semibold" : "text-[#1a2e1f] font-medium"
                  }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          className="grow h-full"
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}
        >
          {/* Reservations List */}
          {filteredReservations.length > 0 ? (
            <View className="grow">
              {filteredReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}

                  onPress={() => handleReservationPress(reservation.id)}
                />
              ))}
            </View>
          ) : (
            <View className="flex-col items-center justify-center py-12">
              <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
                <Ionicons name="bag-outline" size={32} color="#16a34a" />
              </View>
              <Text className="font-semibold text-[#1a2e1f] mb-2 text-lg">
                {selectedStatus === "all" ? "No bookings yet" : `No ${selectedStatus} bookings`}
              </Text>
              <Text className="text-sm text-[#657c69] text-center mb-6">
                {selectedStatus === "all"
                  ? "Start saving food and reducing waste by making your first reservation!"
                  : `You don't have any ${selectedStatus} reservations at the moment.`}
              </Text>
              {selectedStatus === "all" && (
                <TouchableOpacity
                  onPress={() => router.push("/(consumers)/")}
                  className="bg-[#16a34a] rounded-xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">Browse Listings</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
}
