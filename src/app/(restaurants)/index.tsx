import EditListingBottomSheet from "@/components/EditListingBottomSheet";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useGetOwnListings, useUpdateListing } from "@/features/listings";
import {
  getListingDiscount,
  getListingPickupTime,
  getListingQuantitySold,
  Listing,
} from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Map API Listing to RestaurantListing format
const mapListingToRestaurantListing = (listing: Listing) => {
  const discount = getListingDiscount(
    listing.originalPrice,
    listing.discountedPrice
  );

  const quantitySold = getListingQuantitySold(
    listing.quantityTotal,
    listing.quantityAvailable
  );

  const pickupTime = getListingPickupTime(
    listing.pickup.startTime,
    listing.pickup.endTime
  );

  // Map status from API format to UI format
  const statusMap: Record<
    string,
    "active" | "paused" | "sold_out" | "expired"
  > = {
    active: "active",
    paused: "paused",
    soldOut: "sold_out",
    expired: "expired",
    pending: "paused", // Map pending to paused for display
  };

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    imageUrl: listing.photoUrls[0] || "",
    originalPrice: listing.originalPrice,
    currentPrice: listing.discountedPrice,
    discount,
    quantity: listing.quantityTotal,
    quantitySold,
    pickupTime,
    status: statusMap[listing.status] || "paused",
    createdAt: listing.createdAt.toString(),
    category: listing.category,
    isVisible: listing.isVisible,
  };
};

type RestaurantListing = ReturnType<typeof mapListingToRestaurantListing>;

export default function RestaurantListingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const {
    data: listingsResponse,
    isPending,
    error,
    refetch,
  } = useGetOwnListings();
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const updateListingMutation = useUpdateListing();

  // Map API listings to UI format
  const listings = useMemo(() => {
    if (!listingsResponse?.success || !listingsResponse?.data) {
      return [];
    }
    return listingsResponse.data.map(mapListingToRestaurantListing);
  }, [listingsResponse]);

  const getStatusColor = (
    status: "active" | "paused" | "sold_out" | "expired"
  ) => {
    switch (status) {
      case "active":
        return "#16a34a";
      case "paused":
        return "#f59e0b";
      case "sold_out":
        return "#ef4444";
      case "expired":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (
    status: "active" | "paused" | "sold_out" | "expired"
  ) => {
    switch (status) {
      case "active":
        return "Active";
      case "paused":
        return "Paused";
      case "sold_out":
        return "Sold Out";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  const activeListings = listings.filter((l) => l.status === "active");
  const otherListings = listings.filter((l) => l.status !== "active");

  // Get full listing data from API response
  const getFullListing = (listingId: string): Listing | null => {
    if (!listingsResponse?.success || !listingsResponse?.data) {
      return null;
    }
    return listingsResponse.data.find((l) => l.id === listingId) || null;
  };

  // Handle pause listing (set isVisible to false)
  const handlePauseListing = async (listingId: string) => {
    const fullListing = getFullListing(listingId);
    if (!fullListing) {
      Alert.alert("Error", "Could not find listing data");
      return;
    }

    const startTime =
      typeof fullListing.pickup.startTime === "string"
        ? new Date(fullListing.pickup.startTime)
        : fullListing.pickup.startTime;
    const endTime =
      typeof fullListing.pickup.endTime === "string"
        ? new Date(fullListing.pickup.endTime)
        : fullListing.pickup.endTime;

    const payload = {
      listingId,
      title: fullListing.title,
      description: fullListing.description,
      category: fullListing.category,
      originalPrice: fullListing.originalPrice,
      discountedPrice: fullListing.discountedPrice,
      currency: fullListing.currency,
      quantityTotal: fullListing.quantityTotal,
      maxPerUser: fullListing.maxPerUser,
      pickup: {
        startTime,
        endTime,
        location: {
          coordinates: fullListing.pickup.location.coordinates,
        },
        instructions: fullListing.pickup.instructions,
      },
      isVisible: false, // Hide from consumers
    };

    try {
      const response = await updateListingMutation.mutateAsync(payload);
      if (response.success) {
        Alert.alert("Success", "Listing paused successfully");
        refetch();
      } else {
        Alert.alert("Error", response.message || "Failed to pause listing");
      }
    } catch (error) {
      console.error("Error pausing listing:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to pause listing. Please try again."
      );
    }
  };

  // Handle activate listing (set isVisible to true)
  const handleActivateListing = async (listingId: string) => {
    const fullListing = getFullListing(listingId);
    if (!fullListing) {
      Alert.alert("Error", "Could not find listing data");
      return;
    }

    const startTime =
      typeof fullListing.pickup.startTime === "string"
        ? new Date(fullListing.pickup.startTime)
        : fullListing.pickup.startTime;
    const endTime =
      typeof fullListing.pickup.endTime === "string"
        ? new Date(fullListing.pickup.endTime)
        : fullListing.pickup.endTime;

    const payload = {
      listingId,
      title: fullListing.title,
      description: fullListing.description,
      category: fullListing.category,
      originalPrice: fullListing.originalPrice,
      discountedPrice: fullListing.discountedPrice,
      currency: fullListing.currency,
      quantityTotal: fullListing.quantityTotal,
      maxPerUser: fullListing.maxPerUser,
      pickup: {
        startTime,
        endTime,
        location: {
          coordinates: fullListing.pickup.location.coordinates,
        },
        instructions: fullListing.pickup.instructions,
      },
      isVisible: true, // Show to consumers
    };

    try {
      const response = await updateListingMutation.mutateAsync(payload);
      if (response.success) {
        Alert.alert("Success", "Listing activated successfully");
        refetch();
      } else {
        Alert.alert("Error", response.message || "Failed to activate listing");
      }
    } catch (error) {
      console.error("Error activating listing:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to activate listing. Please try again."
      );
    }
  };

  return (
    <CustomSafeAreaView useSafeArea>
      <View className="grow">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#1a2e1f] mb-2">
            My Listings
          </Text>
          <Text className="text-sm text-[#657c69]">
            Manage your surplus food listings
          </Text>
        </View>

        {/* Add New Listing Button */}
        <TouchableOpacity
          onPress={() => router.push("/(restaurants)/create-listing")}
          className="bg-[#16a34a] rounded-2xl p-4 flex-row items-center justify-center mb-6 shadow-sm"
        >
          <Ionicons name="add-circle" size={24} color="#ffffff" />
          <Text className="text-white font-semibold text-base ml-2">
            Create New Listing
          </Text>
        </TouchableOpacity>

        {isPending ? (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-sm text-[#657c69] mt-4">
              Loading listings...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-12">
            <View className="w-16 h-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
            </View>
            <Text className="font-semibold text-[#1a2e1f] mb-1 text-lg">
              Error loading listings
            </Text>
            <Text className="text-sm text-[#657c69] text-center mb-4">
              {error instanceof Error
                ? error.message
                : "Failed to load listings"}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-[#16a34a] rounded-xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            className="grow"
            contentContainerStyle={{
              paddingBottom: tabBarHeight + 10,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isPending}
                onRefresh={refetch}
                tintColor="#16a34a"
              />
            }
          >
            {/* Active Listings */}
            {activeListings.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-bold text-lg text-[#1a2e1f]">
                    Active Listings
                  </Text>
                  <Text className="text-sm text-[#657c69]">
                    {activeListings.length}
                  </Text>
                </View>

                {activeListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
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
                  <Text className="font-bold text-lg text-[#1a2e1f]">
                    Other Listings
                  </Text>
                  <Text className="text-sm text-[#657c69]">
                    {otherListings.length}
                  </Text>
                </View>

                {otherListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    onEdit={() => setEditingListingId(listing.id)}
                    onPause={() => handlePauseListing(listing.id)}
                    onActivate={() => handleActivateListing(listing.id)}
                    isUpdating={updateListingMutation.isPending}
                  />
                ))}
              </View>
            )}

            {listings.length === 0 && (
              <View className="flex-col items-center justify-center py-12">
                <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
                  <Ionicons name="list-outline" size={32} color="#16a34a" />
                </View>
                <Text className="font-semibold text-[#1a2e1f] mb-1 text-lg">
                  No listings yet
                </Text>
                <Text className="text-sm text-[#657c69] text-center mb-4">
                  Create your first listing to start selling surplus food
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(restaurants)/create-listing")}
                  className="bg-[#16a34a] rounded-xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">
                    Create Listing
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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

interface ListingCardProps {
  listing: RestaurantListing;
  getStatusColor: (status: RestaurantListing["status"]) => string;
  getStatusLabel: (status: RestaurantListing["status"]) => string;
  onEdit: () => void;
  onPause: () => void;
  onActivate: () => void;
  isUpdating: boolean;
}

function ListingCard({
  listing,
  getStatusColor,
  getStatusLabel,
  onEdit,
  onPause,
  onActivate,
  isUpdating,
}: ListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const placeholderImage =
    "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const statusColor = getStatusColor(listing.status);
  const statusLabel = getStatusLabel(listing.status);
  const availableQuantity = listing.quantity - listing.quantitySold;

  return (
    <View className="bg-white border-2 border-[rgba(22,163,74,0.2)] rounded-3xl shadow-lg mb-4 overflow-hidden">
      {/* Image Section */}
      <View className="relative h-40">
        <Image
          source={{ uri: imageError ? placeholderImage : listing.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Status Badge */}
        <View
          className="absolute top-3 left-3 rounded-2xl px-3 py-1.5 flex-row items-center"
          style={{ backgroundColor: `${statusColor}20` }}
        >
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: statusColor }}
          />
          <Text className="text-xs font-bold" style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>

        {/* Discount Badge */}
        <View className="absolute top-3 right-3 bg-[#16a34a] rounded-full w-11 h-11 items-center justify-center shadow-md">
          <Text className="text-white text-sm font-bold">
            -{listing.discount}%
          </Text>
        </View>

        {/* Quantity Badge */}
        <View className="absolute bottom-3 left-3 bg-[rgba(220,252,231,0.9)] rounded-2xl px-2.5 py-1 flex-row items-center">
          <Ionicons
            name="cube-outline"
            size={12}
            color="#14532d"
            style={{ marginRight: 4 }}
          />
          <Text className="text-[#14532d] text-xs font-bold">
            {availableQuantity} left
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4">
        <Text className="text-lg font-bold text-[#1a2e1f] mb-1">
          {listing.title}
        </Text>
        <Text className="text-sm text-[#657c69] mb-3" numberOfLines={2}>
          {listing.description}
        </Text>

        {/* Price and Stats */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-[#16a34a]">
              ${listing.currentPrice.toFixed(2)}
            </Text>
            <Text className="text-sm text-[#657c69] line-through ml-2">
              ${listing.originalPrice.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#657c69" />
            <Text className="text-xs text-[#657c69] ml-1">
              {listing.pickupTime}
            </Text>
          </View>
        </View>

        {/* Sales Info */}
        <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-[#e5e7eb]">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text className="text-sm text-[#657c69] ml-2">
              {listing.quantitySold} sold
            </Text>
          </View>
          <Text className="text-xs text-[#657c69]">{listing.category}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          {/* Only show pause/activate for listings that aren't sold out or expired */}
          {listing.status !== "sold_out" &&
            listing.status !== "expired" &&
            (listing.isVisible ? (
              <TouchableOpacity
                onPress={onPause}
                disabled={isUpdating}
                className={`flex-1 bg-[#fef3c7] rounded-xl py-2.5 flex-row items-center justify-center ${
                  isUpdating ? "opacity-50" : ""
                }`}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#f59e0b" />
                ) : (
                  <>
                    <Ionicons name="pause" size={16} color="#f59e0b" />
                    <Text className="text-[#f59e0b] font-semibold text-sm ml-1">
                      Pause
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onActivate}
                disabled={isUpdating}
                className={`flex-1 bg-[#dcfce7] rounded-xl py-2.5 flex-row items-center justify-center ${
                  isUpdating ? "opacity-50" : ""
                }`}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#16a34a" />
                ) : (
                  <>
                    <Ionicons name="play" size={16} color="#16a34a" />
                    <Text className="text-[#16a34a] font-semibold text-sm ml-1">
                      Activate
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          <TouchableOpacity
            onPress={onEdit}
            disabled={isUpdating}
            className={`flex-1 bg-[#eff2f0] rounded-xl py-2.5 flex-row items-center justify-center ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <Ionicons name="create-outline" size={16} color="#657c69" />
            <Text className="text-[#657c69] font-semibold text-sm ml-1">
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
