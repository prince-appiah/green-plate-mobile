import FoodCard from "@/components/FoodCard";
import { useGetPublicListingsSuspense } from "@/features/listings/hooks/use-public-listings";
import { GetPublicListingsQuery, GetPublicListingsResponse } from "@/features/listings/services/listings-types";
import { calculateDiscountPercentage, formatCurrency, formatTimeRange } from "@/features/shared";
import { getFormattedDistance } from "@/lib/distance";
import { router } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

interface ListingsListProps {
  queryParams: GetPublicListingsQuery;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  tabBarHeight: number;
  userLocation: { latitude: number; longitude: number } | null;
}

export function ListingsList({
  queryParams,
  favorites,
  onToggleFavorite,
  tabBarHeight,
  userLocation,
}: ListingsListProps) {
  const { data: listingsResponse, refetch, isPending } = useGetPublicListingsSuspense(queryParams);
  const listings = listingsResponse.data;

  const mapListingToFoodCard = (listing: GetPublicListingsResponse) => {
    const imageUrl = listing.photoUrls?.[0] || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
    const discount = calculateDiscountPercentage(listing.originalPrice, listing.discountedPrice);
    const timeRange = formatTimeRange(listing.pickup.startTime, listing.pickup.endTime);

    let distance = "0.0 mi";
    if (userLocation) {
      const [longitude, latitude] = listing.pickup.location.coordinates;
      distance = getFormattedDistance(userLocation.latitude, userLocation.longitude, latitude, longitude, "mi");
    }

    return {
      id: listing.id,
      imageUrl,
      restaurantName: listing.restaurant.name,
      distance,
      rating: "4.5",
      reviews: "0",
      categories: [listing.category],
      itemName: listing.title,
      currentPrice: formatCurrency(listing.discountedPrice),
      originalPrice: formatCurrency(listing.originalPrice),
      discount,
      timeRange,
      itemsLeft: listing.quantityAvailable.toString(),
      isFavorited: favorites.includes(listing.id),
      onFavoritePress: () => onToggleFavorite(listing.id),
      onPress: () => router.push(`/(consumers)/listing/${listing.id}`),
    };
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}
    >
      <View className="flex-row items-center justify-between my-4">
        <Text className="font-bold text-[#1a2e1f] text-base">Nearby Surplus</Text>
        <Text className="text-sm text-[#657c69]">{listings.length} available</Text>
      </View>

      {listings.length > 0 ? (
        <View>
          {listings.map((listing) => {
            const cardProps = mapListingToFoodCard(listing);
            return (
              <FoodCard
                key={listing.id}
                imageUrl={cardProps.imageUrl}
                restaurantName={cardProps.restaurantName}
                distance={cardProps.distance}
                rating={cardProps.rating}
                reviews={cardProps.reviews}
                categories={cardProps.categories}
                itemName={cardProps.itemName}
                currentPrice={cardProps.currentPrice}
                originalPrice={cardProps.originalPrice}
                discount={cardProps.discount}
                timeRange={cardProps.timeRange}
                itemsLeft={cardProps.itemsLeft}
                isFavorited={cardProps.isFavorited}
                onFavoritePress={cardProps.onFavoritePress}
                onPress={cardProps.onPress}
              />
            );
          })}
        </View>
      ) : (
        <View className="flex-col items-center justify-center py-12">
          <Text className="text-4xl mb-3">🔍</Text>
          <Text className="font-semibold text-[#1a2e1f] mb-1">No listings found</Text>
          <Text className="text-sm text-[#657c69] text-center">Try adjusting your search or filters</Text>
        </View>
      )}
    </ScrollView>
  );
}
