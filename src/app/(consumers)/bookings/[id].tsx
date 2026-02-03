import {
  ListingDetailsCard,
  PickupDatesCard,
  PickupQRCode,
  ReservationActions,
  ReservationHeader,
  ReservationInfoCard,
} from "@/components/screens/consumers/bookings";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useReservationDetailsModel } from "@/features/reservations/hooks/use-reservation-details-model";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

function ReservationDetailsContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    reservation,
    listing,
    statusInfo,
    imageUrl,
    timeRange,
    isLoading,
    isCancelling,
    canCancel,
    handleRefresh,
    handleCancel,
  } = useReservationDetailsModel(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-sm text-[#657c69] mt-4">Loading reservation details...</Text>
      </View>
    );
  }

  if (!reservation) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">Reservation not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#16a34a] rounded-xl px-6 py-3 mt-4">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#16a34a" />}
    >
      {/* Header with image and status badge */}
      <ReservationHeader
        imageUrl={imageUrl}
        statusBadge={
          statusInfo && (
            <View
              className="rounded-full px-4 py-2 flex-row items-center"
              style={{ backgroundColor: statusInfo.bgColor }}
            >
              <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} style={{ marginRight: 6 }} />
              <Text className="text-sm font-bold" style={{ color: statusInfo.color }}>
                {statusInfo.label}
              </Text>
            </View>
          )
        }
      />

      {/* Content Section */}
      <View className="px-4 pt-6 pb-8">
        {/* Title and Restaurant */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">{listing?.title || "Reservation Details"}</Text>
          {listing?.restaurant?.name && (
            <View className="flex-row items-center">
              <Ionicons name="restaurant" size={16} color="#657c69" />
              <Text className="text-[#657c69] text-base ml-2">{listing.restaurant.name}</Text>
            </View>
          )}
        </View>

        {/* Reservation Info Card */}
        <ReservationInfoCard
          reservationId={reservation.id}
          quantity={reservation.quantity}
          unitPrice={reservation.totalPrice / reservation.quantity}
          totalPrice={reservation.totalPrice}
        />

        {/* Pickup Dates */}
        <PickupDatesCard
          reservationDate={reservation.createdAt}
          pickupTimeRange={timeRange}
          pickupInstructions={listing?.pickup.instructions}
        />

        {/* QR Code for Pickup */}
        {reservation.status === "ready_for_pickup" && reservation.pickup?.code && (
          <PickupQRCode pickupCode={reservation.pickup.code} />
        )}

        {/* Listing Details */}
        {listing && <ListingDetailsCard listing={listing} />}

        {/* Action Buttons */}
        <ReservationActions
          canCancel={canCancel}
          isCancelling={isCancelling}
          onCancel={handleCancel}
          listingId={listing?.id}
        />
      </View>
    </ScrollView>
  );
}

export default function ReservationDetailsScreen() {
  return (
    <CustomSafeAreaView>
      <ReservationDetailsContent />
    </CustomSafeAreaView>
  );
}
