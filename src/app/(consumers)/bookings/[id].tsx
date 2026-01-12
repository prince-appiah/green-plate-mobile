import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { format } from "date-fns";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGetReservationById } from "@/features/reservations";
import { useGetPublicListingById } from "@/features/listings/hooks/use-public-listings";
import { useCancelReservation } from "@/features/reservations";
import { formatCurrency, formatTimeRange } from "@/features/shared";
import { getReservationStatusConfig } from "@/features/reservations/helpers";
import {
  useUpdateMyReservationStatus,
  useUpdateReservationStatus,
} from "@/features/reservations/hooks/use-restaurant-reservations";

function ReservationDetailsLoadingFallback() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#16a34a" />
      <Text className="text-sm text-[#657c69] mt-4">Loading reservation...</Text>
    </View>
  );
}

function ReservationDetailsContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: reservationResponse,
    isPending: isLoadingReservation,
    refetch: refetchReservation,
  } = useGetReservationById(id);
  const reservation = reservationResponse?.data;

  const {
    data: listingResponse,
    isPending: isLoadingListing,
    refetch: refetchListing,
  } = useGetPublicListingById(reservation?.listingId!);
  const listing = listingResponse?.data;

  const { mutate: updateMyReservationStatus, isPending: isCancelling } = useUpdateMyReservationStatus();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (isLoadingReservation || isLoadingListing) {
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

  const statusInfo = getReservationStatusConfig(reservation.status);
  const imageUrl = listing?.photoUrls?.[0] || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const timeRange = listing ? formatTimeRange(listing.pickup.startTime, listing.pickup.endTime) : "N/A";

  const canCancel = reservation.status === "pending";

  const handleCancel = () => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            updateMyReservationStatus(
              {
                reservationId: reservation.id,
                status: "cancelled",
              },
              {
                onSuccess: () => {
                  Alert.alert("Reservation Cancelled", "Your reservation has been cancelled successfully.", [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]);
                },
                onError: (error: any) => {
                  Alert.alert(
                    "Cancellation Failed",
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to cancel reservation. Please try again."
                  );
                },
              }
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingReservation || isLoadingListing}
          onRefresh={async () => {
            await Promise.all([refetchReservation(), refetchListing()]);
          }}
          tintColor="#16a34a"
        />
      }
    >
      {/* Header with back button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.push("/(consumers)/bookings")}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-md"
        >
          <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View className="relative h-80">
        <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
          }}
        />

        {/* Status Badge */}
        <View className="absolute top-12 right-4">
          <View
            className="rounded-full px-4 py-2 flex-row items-center"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} style={{ marginRight: 6 }} />
            <Text className="text-sm font-bold" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </Text>
          </View>
        </View>
      </View>

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

        {/* Reservation Info */}
        <View className="bg-[rgba(220,252,231,0.3)] border border-[#dcfce7] rounded-2xl p-4 mb-4">
          <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Reservation Information</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-[#657c69]">Reservation ID</Text>
              <Text className="text-sm font-semibold text-[#1a2e1f]">{reservation.id.slice(0, 8)}...</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-[#657c69]">Quantity</Text>
              <Text className="text-sm font-semibold text-[#1a2e1f]">{reservation.quantity}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-[#657c69]">Unit Price</Text>
              <Text className="text-sm font-semibold text-[#1a2e1f]">
                {formatCurrency(reservation.totalPrice / reservation.quantity)}
              </Text>
            </View>
            <View className="border-t border-[#dcfce7] pt-3 mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-bold text-[#1a2e1f]">Total Price</Text>
                <Text className="text-2xl font-bold text-[#16a34a]">{formatCurrency(reservation.totalPrice)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dates */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">Important Dates</Text>
          <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
            <View className="flex-row items-start">
              <Ionicons name="calendar-outline" size={20} color="#16a34a" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-sm text-[#657c69] mb-1">Reservation Date</Text>
                <Text className="text-base font-semibold text-[#1a2e1f]">
                  {format(reservation.createdAt, "MMMM dd, yyyy")}
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Ionicons name="time-outline" size={20} color="#16a34a" style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-sm text-[#657c69] mb-1">Pickup Time</Text>
                <Text className="text-base font-semibold text-[#1a2e1f]">{timeRange}</Text>
                {listing?.pickup.instructions && (
                  <Text className="text-sm text-[#657c69] mt-1">{listing.pickup.instructions}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* QR Code for Pickup - Show when ready_for_pickup */}
        {reservation.status === "ready_for_pickup" && reservation.pickup?.code && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">Pickup Code</Text>
            <View className="bg-white border border-[#e5e7eb] rounded-2xl p-6 items-center">
              <Text className="text-sm text-[#657c69] mb-4 text-center">
                Show this QR code to the restaurant to complete your pickup
              </Text>
              {/* QR Code Container */}
              <View className="bg-white p-4 rounded-2xl border-2 border-[#16a34a] mb-4">
                <QRCode value={reservation.pickup.code} size={200} backgroundColor="white" color="#1a2e1f" />
              </View>
              {/* Pickup Code Text */}
              <View className="bg-[rgba(220,252,231,0.3)] rounded-xl px-6 py-3 border border-[#dcfce7]">
                <Text className="text-xs text-[#657c69] mb-1 text-center">Pickup Code</Text>
                <Text className="text-2xl font-bold text-[#16a34a] text-center tracking-widest">
                  {reservation.pickup.code}
                </Text>
              </View>
              <Text className="text-xs text-[#657c69] mt-4 text-center">
                The restaurant will scan this code to verify your pickup
              </Text>
            </View>
          </View>
        )}

        {/* Listing Details */}
        {listing && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">Listing Details</Text>
            <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4">
              {listing.description && <Text className="text-base text-[#657c69] mb-3">{listing.description}</Text>}
              <View className="flex-row items-center">
                <View className="bg-[rgba(220,252,231,0.4)] rounded-xl px-3 py-1">
                  <Text className="text-[#14532d] text-sm font-medium capitalize">{listing.category}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {canCancel && (
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isCancelling}
            className={`bg-red-500 rounded-2xl py-4 items-center justify-center shadow-lg mb-3 ${isCancelling ? "opacity-50" : ""
              }`}
            activeOpacity={0.8}
          >
            {isCancelling ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-lg font-bold">Cancel Reservation</Text>
            )}
          </TouchableOpacity>
        )}

        {/* View Listing Button */}
        {listing && (
          <TouchableOpacity
            onPress={() => router.push(`/(consumers)/listing/${listing.id}`)}
            className="bg-[#16a34a] rounded-2xl py-4 items-center justify-center shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-bold">View Original Listing</Text>
          </TouchableOpacity>
        )}
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
