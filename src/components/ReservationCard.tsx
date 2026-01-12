import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetPublicListingById } from "@/features/listings/hooks/use-public-listings";
import { formatCurrency, Reservation } from "@/features/shared";
import { getReservationStatusConfig } from "@/features/reservations/helpers";
import { format, formatDate } from "date-fns";

interface ReservationCardProps {
  reservation: Reservation;
  onPress?: () => void;
}



export default function ReservationCard({ reservation, onPress }: ReservationCardProps) {
  // const { data: listingResponse, isPending: isLoadingListing } = useGetPublicListingById(reservation.listingId);
  const listing = reservation.listing;
  const restaurant = reservation.restaurant;

  const config = getReservationStatusConfig(reservation.status);

  const placeholderImage = "https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Food";
  const imageUrl = listing?.photoUrls?.[0] || placeholderImage;
  const title = listing?.title || "Loading...";
  const restaurantName = restaurant?.name || "";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-[#e5e7eb] shadow-sm"
      disabled={!onPress}
    >
      <View className="flex-row gap-4">
        <Image source={{ uri: imageUrl }} className="w-20 h-20 rounded-xl" resizeMode="cover" />

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="font-bold text-sm text-[#1a2e1f] flex-1" numberOfLines={1}>
              {title}
            </Text>
            <View
              className="px-2 py-1 rounded-lg flex-row items-center gap-1"
              style={{ backgroundColor: config.bgColor }}
            >
              <Ionicons name={config.icon} size={12} color={config.color} />
              <Text className="text-xs font-semibold" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
          </View>

          {restaurantName && (
            <Text className="text-xs text-[#657c69] mb-2" numberOfLines={1}>
              {restaurantName}
            </Text>
          )}

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs text-[#657c69]">{format(reservation.createdAt, "MMM dd, yyyy")}</Text>
              {reservation.quantity > 1 && (
                <Text className="text-xs text-[#657c69]">• Qty: {reservation.quantity}</Text>
              )}
            </View>
            <Text className="text-sm font-bold text-[#16a34a]">{formatCurrency(reservation.totalPrice)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
