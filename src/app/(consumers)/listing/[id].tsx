import ReservationBottomSheet from "@/components/ReservationBottomSheet";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGetPublicListingByIdSuspense } from "@/features/listings/hooks/use-public-listings";
import { reservationsQueryKeys } from "@/features/reservations";
import {
  calculateDiscountPercentage,
  formatCurrency,
  formatTimeRange,
} from "@/features/shared";
import { queryClient } from "@/lib/query-client";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { Suspense, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Loading fallback component
function ListingDetailsLoadingFallback() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#16a34a" />
      <Text className="text-sm text-[#657c69] mt-4">Loading listing...</Text>
    </View>
  );
}

// Main content component that uses Suspense
function ListingDetailsContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: listingResponse,
    refetch,
    isPending,
  } = useGetPublicListingByIdSuspense(id);
  const response = listingResponse;
  const listing = response?.data;
  const [showReservationSheet, setShowReservationSheet] = useState(false);

  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">
          Listing not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#16a34a] rounded-xl px-6 py-3 mt-4"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl =
    listing.photoUrls?.[0] ||
    "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const discount = calculateDiscountPercentage(
    listing.originalPrice,
    listing.discountedPrice
  );
  const timeRange = formatTimeRange(
    listing.pickup.startTime,
    listing.pickup.endTime
  );

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isPending}
          onRefresh={refetch}
          tintColor="#16a34a"
        />
      }
    >
      {/* Header with back button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-md"
        >
          <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View className="relative h-80">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
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

        {/* Discount Badge */}
        <View className="absolute top-12 right-4 bg-[#16a34a] rounded-full w-16 h-16 items-center justify-center shadow-lg">
          <Text className="text-white text-lg font-bold">{discount}</Text>
        </View>

        {/* Time Badge */}
        <View className="absolute bottom-4 left-4 bg-[rgba(220,252,231,0.9)] rounded-2xl px-3 py-2 flex-row items-center">
          <Ionicons
            name="time-outline"
            size={14}
            color="#14532d"
            style={{ marginRight: 6 }}
          />
          <Text className="text-[#14532d] text-sm font-bold">{timeRange}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="px-4 pt-6 pb-8">
        {/* Title and Restaurant */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">
            {listing.title}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="restaurant" size={16} color="#657c69" />
            <Text className="text-[#657c69] text-base ml-2">
              {listing.title}
            </Text>
          </View>
        </View>

        {/* Price Section */}
        <View className="bg-[rgba(220,252,231,0.3)] border border-[#dcfce7] rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-[#657c69] mb-1">Price</Text>
              <View className="flex-row items-center">
                <Text className="text-3xl font-bold text-[#16a34a] mr-3">
                  {formatCurrency(listing.discountedPrice)}
                </Text>
                <Text className="text-lg text-[#657c69] line-through">
                  {formatCurrency(listing.originalPrice)}
                </Text>
              </View>
            </View>
            <View className="bg-[rgba(22,163,74,0.1)] rounded-2xl px-4 py-2">
              <Text className="text-[#16a34a] text-sm font-bold">
                {listing.quantityAvailable} left
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">
            Description
          </Text>
          <Text className="text-[#657c69] text-base leading-6">
            {listing.description}
          </Text>
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">
            Category
          </Text>
          <View className="bg-[rgba(220,252,231,0.4)] rounded-2xl px-4 py-2 self-start">
            <Text className="text-[#14532d] text-sm font-medium capitalize">
              {listing.category}
            </Text>
          </View>
        </View>

        {/* Pickup Information */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">
            Pickup Information
          </Text>
          <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
            <View className="flex-row items-start">
              <Ionicons
                name="time-outline"
                size={20}
                color="#16a34a"
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <View className="flex-1">
                <Text className="text-sm text-[#657c69] mb-1">Pickup Time</Text>
                <Text className="text-base font-semibold text-[#1a2e1f]">
                  {timeRange}
                </Text>
              </View>
            </View>
            {listing.pickup.instructions && (
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#16a34a"
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-sm text-[#657c69] mb-1">
                    Instructions
                  </Text>
                  <Text className="text-base text-[#1a2e1f]">
                    {listing.pickup.instructions}
                  </Text>
                </View>
              </View>
            )}
            {/* Location: Not available from API - keeping structure for future */}
            {/* TODO: Add location/address display when available in API response */}
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">
            Restaurant Information
          </Text>
          <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4">
            <Text className="text-base font-semibold text-[#1a2e1f] mb-2">
              {listing.title}
            </Text>
            {listing.description && (
              <Text className="text-sm text-[#657c69] mb-3">
                {listing.description}
              </Text>
            )}
            {/* Rating: Not available from API - keeping structure for future */}
            {/* TODO: Add rating display when available in API response */}
            {/* Reviews: Not available from API - keeping structure for future */}
            {/* TODO: Add reviews display when available in API response */}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => setShowReservationSheet(true)}
          className="bg-[#16a34a] rounded-2xl py-4 items-center justify-center shadow-lg"
          activeOpacity={0.8}
          disabled={
            !listing.quantityAvailable || listing.quantityAvailable === 0
          }
        >
          <Text className="text-white text-lg font-bold">
            {listing.quantityAvailable > 0 ? "Reserve Now" : "Sold Out"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reservation Bottom Sheet */}
      <ReservationBottomSheet
        visible={showReservationSheet}
        onClose={() => setShowReservationSheet(false)}
        listing={listing}
        onSuccess={() => {
          // Optionally navigate to bookings or refresh data
          queryClient.invalidateQueries({
            queryKey: reservationsQueryKeys.getCustomerReservationById(id),
          });

          // router.push("/(consumers)/bookings");
        }}
      />
    </ScrollView>
  );
}

export default function ListingDetailsScreen() {
  return (
    <CustomSafeAreaView>
      <Suspense fallback={<ListingDetailsLoadingFallback />}>
        <ListingDetailsContent />
      </Suspense>
    </CustomSafeAreaView>
  );
}
