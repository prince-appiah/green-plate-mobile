import {
  ListingCategoryCard,
  ListingDescriptionCard,
  ListingImageHeader,
  ListingPickupCard,
  ListingPriceSection,
  ListingReserveButton,
  ListingRestaurantCard,
  ListingTitleSection,
} from "@/components/screens/consumers/listing";
import ReservationBottomSheet from "@/components/screens/consumers/reservation-bottom-sheet/reservation-bottom-sheet";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useListingDetails } from "@/features/listings/hooks/use-listing-details";
import { reservationsQueryKeys } from "@/features/reservations";
import { calculateDiscountPercentage, formatCurrency, formatTimeRange } from "@/features/shared";
import { queryClient } from "@/lib/query-client";
import React, { Suspense, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  const { listing, refetch, isPending } = useListingDetails();
  const [showReservationSheet, setShowReservationSheet] = useState(false);

  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">Listing not found</Text>
        <TouchableOpacity
          onPress={() => setShowReservationSheet(false)}
          className="bg-[#16a34a] rounded-xl px-6 py-3 mt-4"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = listing.photoUrls?.[0] || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const discount = calculateDiscountPercentage(listing.originalPrice, listing.discountedPrice);
  const timeRange = formatTimeRange(listing.pickup.startTime, listing.pickup.endTime);

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}
    >
      {/* Image Header with Badges */}
      <ListingImageHeader imageUrl={imageUrl} discount={discount} timeRange={timeRange} />

      {/* Content Section */}
      <View className="px-4 pt-6 pb-8">
        {/* Title and Restaurant */}
        <ListingTitleSection title={listing.title} restaurantName={listing.title} />

        {/* Price Section */}
        <ListingPriceSection
          discountedPrice={formatCurrency(listing.discountedPrice)}
          originalPrice={formatCurrency(listing.originalPrice)}
          quantityAvailable={listing.quantityAvailable}
        />

        {/* Description */}
        <ListingDescriptionCard description={listing.description} />

        {/* Category */}
        <ListingCategoryCard category={listing.category} />

        {/* Pickup Information */}
        <ListingPickupCard timeRange={timeRange} instructions={listing.pickup.instructions} />

        {/* Restaurant Info */}
        <ListingRestaurantCard restaurantName={listing.title} description={listing.description} />

        {/* Action Button */}
        <ListingReserveButton
          onPress={() => setShowReservationSheet(true)}
          quantityAvailable={listing.quantityAvailable}
        />
      </View>

      {/* Reservation Bottom Sheet */}
      <ReservationBottomSheet
        visible={showReservationSheet}
        onClose={() => setShowReservationSheet(false)}
        listing={listing}
        onSuccess={() => {
          // Optionally navigate to bookings or refresh data
          queryClient.invalidateQueries({
            queryKey: reservationsQueryKeys.getCustomerReservationById(listing.id),
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
