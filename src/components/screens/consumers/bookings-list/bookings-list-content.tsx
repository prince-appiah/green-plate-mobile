import ReservationCard from "@/components/ReservationCard";
import { Reservation } from "@/features/shared";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";

interface BookingsListContentProps {
  reservations: Reservation[];
  isPending: boolean;
  tabBarHeight: number;
  onRefresh: () => void;
  onReservationPress: (id: string) => void;
}

/**
 * Bookings list content component
 * Displays all reservation cards in a scrollable list
 */
export function BookingsListContent({
  reservations,
  isPending,
  tabBarHeight,
  onRefresh,
  onReservationPress,
}: BookingsListContentProps) {
  return (
    <ScrollView
      className="grow h-full"
      contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={onRefresh} tintColor="#16a34a" />}
    >
      <View className="grow">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onPress={() => onReservationPress(reservation.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
