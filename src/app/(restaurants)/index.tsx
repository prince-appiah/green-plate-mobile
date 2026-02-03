import EditListingBottomSheet from "@/components/EditListingBottomSheet";
import {
  EmptyListingsState,
  ErrorListingsState,
  handleActivateListingAction,
  handlePauseListingAction,
  ListingCard,
  LoadingListingsState,
  mapListingToRestaurantListing,
} from "@/components/screens/restaurants/restaurant-listings-screen";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGetOwnListings, useUpdateListing } from "@/features/listings";
import { Listing } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RestaurantListingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const { data: listingsResponse, isPending, error, refetch } = useGetOwnListings();
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const updateListingMutation = useUpdateListing();

  // Map API listings to UI format
  const listings = useMemo(() => {
    if (!listingsResponse?.success || !listingsResponse?.data) {
      return [];
    }
    return listingsResponse.data.map(mapListingToRestaurantListing);
  }, [listingsResponse]);

  const activeListings = listings.filter((l) => l.status === "active");
  const otherListings = listings.filter((l) => l.status !== "active");

  // Get full listing data from API response
  const getFullListing = (listingId: string): Listing | null => {
    if (!listingsResponse?.success || !listingsResponse?.data) {
      return null;
    }
    return listingsResponse.data.find((l) => l.id === listingId) || null;
  };

  // Handle pause listing
  const handlePauseListing = async (listingId: string) => {
    const fullListing = getFullListing(listingId);
    await handlePauseListingAction(fullListing, updateListingMutation.mutateAsync, refetch);
  };

  // Handle activate listing
  const handleActivateListing = async (listingId: string) => {
    const fullListing = getFullListing(listingId);
    await handleActivateListingAction(fullListing, updateListingMutation.mutateAsync, refetch);
  };

  return (
    <CustomSafeAreaView useSafeArea>
      <View className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">My Listings</Text>
          <Text className="text-sm text-[#657c69]">Manage your surplus food listings</Text>
        </View>

        {/* Add New Listing Button */}
        {listings.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/(restaurants)/create-listing")}
            className="bg-[#16a34a] rounded-2xl p-4 flex-row items-center justify-center mb-6 shadow-sm"
          >
            <Ionicons name="add-circle" size={24} color="#ffffff" />
            <Text className="text-white font-semibold text-base ml-2">Create New Listing</Text>
          </TouchableOpacity>
        )}

        {isPending ? (
          <LoadingListingsState />
        ) : error ? (
          <ErrorListingsState error={error} onRetry={refetch} />
        ) : (
          <ScrollView
            className="grow"
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}
          >
            {/* Active Listings */}
            {activeListings.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-bold text-lg text-[#1a2e1f]">Active Listings</Text>
                  <Text className="text-sm text-[#657c69]">{activeListings.length}</Text>
                </View>

                {activeListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onEdit={() => setEditingListingId(listing.id)}
                    onPause={() => handlePauseListing(listing.id)}
                    onActivate={() => handleActivateListing(listing.id)}
                    isUpdating={updateListingMutation.isPending}
                  />
                ))}
              </View>
            )}

            {/* Other Listings */}
            {otherListings.length > 0 && (
              <View>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-bold text-lg text-[#1a2e1f]">Other Listings</Text>
                  <Text className="text-sm text-[#657c69]">{otherListings.length}</Text>
                </View>

                {otherListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onEdit={() => setEditingListingId(listing.id)}
                    onPause={() => handlePauseListing(listing.id)}
                    onActivate={() => handleActivateListing(listing.id)}
                    isUpdating={updateListingMutation.isPending}
                  />
                ))}
              </View>
            )}

            {listings.length === 0 && <EmptyListingsState />}
          </ScrollView>
        )}
      </View>

      {/* Edit Listing Bottom Sheet */}
      {editingListingId && (
        <EditListingBottomSheet
          visible={!!editingListingId}
          onClose={() => setEditingListingId(null)}
          listingId={editingListingId}
          onSuccess={() => {
            setEditingListingId(null);
            refetch();
          }}
        />
      )}
    </CustomSafeAreaView>
  );
}
