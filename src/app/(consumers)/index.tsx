import FoodCard from "@/components/FoodCard";
import CategoryFilters from "@/components/screens/consumers/discovery/CategoryFilters";
import MapView from "@/components/screens/consumers/discovery/MapView";
import ViewToggle from "@/components/screens/consumers/discovery/ViewToggle";
import { StyledImage } from "@/components/ui/image";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import {
  useGetPublicListings,
  useGetPublicListingsSuspense,
} from "@/features/listings/hooks/use-public-listings";
import {
  GetPublicListingsQuery,
  GetPublicListingsResponse,
} from "@/features/listings/services/listings-types";
import {
  calculateDiscountPercentage,
  capitalizeFirstLetter,
  formatCurrency,
  formatTimeRange,
  ListingCategories,
  ListingCategory,
  useLocation,
} from "@/features/shared";
import { getFormattedDistance } from "@/lib/distance";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Placeholder hero image
const heroImagePlaceholder = "../../assets/images/hero_food.jpg";

// Create category filter options from ListingCategories
const categoryFilterOptions = [
  { label: "All", value: "all" },
  ...ListingCategories.map((category) => ({
    label: capitalizeFirstLetter(category),
    value: category,
  })),
];

// Loading fallback component
function ListingsLoadingFallback() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#16a34a" />
      <Text className="text-sm text-[#657c69] mt-4">Loading listings...</Text>
    </View>
  );
}

// Component that fetches and displays listings for map view
interface MapListingsProps {
  queryParams: GetPublicListingsQuery;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  tabBarHeight: number;
  userLocation: { latitude: number; longitude: number } | null;
  showNearMe: boolean;
  onToggleNearMe: () => void;
  hasLocationPermission?: boolean;
  isLoadingLocation?: boolean;
}

function MapListings({
  queryParams,
  favorites,
  onToggleFavorite,
  tabBarHeight,
  userLocation,
  showNearMe,
  onToggleNearMe,
  hasLocationPermission,
  isLoadingLocation,
}: MapListingsProps) {
  // Use regular query instead of suspense so map renders immediately
  const { data: listingsResponse, isLoading } =
    useGetPublicListings(queryParams);
  const listings = listingsResponse?.data || [];

  return (
    <MapView
      listings={listings}
      favorites={favorites}
      tabBarHeight={tabBarHeight}
      onToggleFavorite={onToggleFavorite}
      userLocation={userLocation}
      isLoadingLocation={isLoadingLocation}
      showNearMe={showNearMe}
      onToggleNearMe={onToggleNearMe}
      hasLocationPermission={hasLocationPermission}
    />
  );
}

// Component that fetches and displays listings (wrapped in Suspense)
interface ListingsListProps {
  queryParams: GetPublicListingsQuery;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  tabBarHeight: number;
  userLocation: { latitude: number; longitude: number } | null;
}

function ListingsList({
  queryParams,
  favorites,
  onToggleFavorite,
  tabBarHeight,
  userLocation,
}: ListingsListProps) {
  // Use suspense hook to fetch public listings with query parameters
  const {
    data: listingsResponse,
    refetch,
    isPending,
  } = useGetPublicListingsSuspense(queryParams);
  const listings = listingsResponse.data;

  // Map listing to FoodCard props
  const mapListingToFoodCard = (listing: GetPublicListingsResponse) => {
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

    // Calculate distance if user location is available
    let distance = "0.0 mi";
    if (userLocation) {
      const [longitude, latitude] = listing.pickup.location.coordinates;
      distance = getFormattedDistance(
        userLocation.latitude,
        userLocation.longitude,
        latitude,
        longitude,
        "mi"
      );
    }

    return {
      id: listing.id,
      imageUrl,
      restaurantName: listing.restaurant.name,
      distance,
      // rating: Not available from API - keeping mock data structure
      rating: "4.5", // TODO: Add rating to API response
      // reviews: Not available from API - keeping mock data structure
      reviews: "0", // TODO: Add reviews count to API response
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
      refreshControl={
        <RefreshControl
          refreshing={isPending}
          onRefresh={refetch}
          tintColor="#16a34a"
        />
      }
    >
      <View className="flex-row items-center justify-between my-4">
        <Text className="font-bold text-[#1a2e1f] text-base">
          Nearby Surplus
        </Text>
        <Text className="text-sm text-[#657c69]">
          {listings.length} available
        </Text>
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
          <Text className="font-semibold text-[#1a2e1f] mb-1">
            No listings found
          </Text>
          <Text className="text-sm text-[#657c69] text-center">
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// Main content component
function DiscoverContent() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showNearMe, setShowNearMe] = useState(false);

  // Location hook
  const {
    location: userLocation,
    isLoading: isLoadingLocation,
    hasPermission: hasLocationPermission,
    getCurrentLocation,
    requestPermission,
  } = useLocation();

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query parameters for API
  const queryParams = useMemo<GetPublicListingsQuery>(() => {
    const params: GetPublicListingsQuery = {};

    // Add category filter only if it's not "all" and not empty
    if (
      selectedCategory &&
      selectedCategory !== "all" &&
      selectedCategory.trim() !== ""
    ) {
      params.category = selectedCategory as ListingCategory;
    }

    // Add search query if provided
    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }

    // Add location-based filtering when "near me" is enabled
    if (showNearMe && userLocation) {
      params.latitude = userLocation.latitude;
      params.longitude = userLocation.longitude;
      params.radiusKm = 10; // 10km radius (note: API has typo "raidusKm" instead of "radiusKm")
    }

    return params;
  }, [selectedCategory, debouncedSearchQuery, showNearMe, userLocation]);

  const handleToggleNearMe = async () => {
    if (!showNearMe) {
      // Enabling near me - first request permission, then get location
      const hasPermission = await requestPermission();
      if (hasPermission) {
        setShowNearMe(true);
        await getCurrentLocation();
      }
    } else {
      // Disabling near me
      setShowNearMe(false);
    }
  };

  // Calculate bottom padding for tab bar (60px tab bar + safe area bottom)
  const tabBarHeight =
    Platform.OS === "ios"
      ? 60 + Math.max(insets.bottom, 8)
      : 60 + Math.max(insets.bottom, 8);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Hero Section - Only show in list mode */}
      {viewMode === "list" && (
        <View className="relative h-44 overflow-hidden">
          <StyledImage
            source={Asset.fromModule(require(heroImagePlaceholder))}
            className="h-full w-full object-cover"
          />
          <LinearGradient
            colors={[
              "rgba(239, 242, 240, 0)",
              "rgba(239, 242, 240, 0.6)",
              "rgba(239, 242, 240, 1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-xl font-bold mb-1 text-[#1a2e1f]">
              Save food today 🌿
            </Text>
            <Text className="text-sm text-[#657c69]">
              Rescue delicious surplus from nearby restaurants
            </Text>
          </View>
        </View>
      )}

      {viewMode === "map" ? (
        <>
          {/* Map View - Full Screen */}
          <View style={{ flex: 1 }}>
            <MapListings
              queryParams={queryParams}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              tabBarHeight={tabBarHeight}
              userLocation={userLocation}
              showNearMe={showNearMe}
              onToggleNearMe={handleToggleNearMe}
              hasLocationPermission={hasLocationPermission || false}
              isLoadingLocation={isLoadingLocation}
            />
          </View>

          {/* View Mode Toggle - Overlay on Map (Top) */}
          <View
            style={{
              position: "absolute",
              top: insets.top + 8,
              left: 16,
              right: 16,
              zIndex: 20,
            }}
          >
            <View className="flex justify-center flex-row items-center">
              <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            </View>
          </View>

          {/* Search and Filter - Overlay on Map (Below Toggle) */}
          <View
            style={{
              position: "absolute",
              top: insets.top + 60, // Position below view toggle
              left: 16,
              right: 16,
              zIndex: 10,
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="relative flex-1">
                <Ionicons
                  name="search"
                  size={16}
                  color="#657c69"
                  style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
                />
                <TextInput
                  placeholder="Search restaurants or food..."
                  placeholderTextColor="#657c69"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="w-full rounded-xl border border-[#e5e7eb] bg-white py-3 pl-10 pr-4 text-sm text-[#1a2e1f]"
                  style={{ fontSize: 14 }}
                />
              </View>
              <TouchableOpacity className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white">
                <Ionicons name="options-outline" size={20} color="#657c69" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View className="px-4 grow pt-4 space-y-4">
          {/* Search and Filter */}
          <View className="flex-row items-center gap-3">
            <View className="relative flex-1">
              <Ionicons
                name="search"
                size={16}
                color="#657c69"
                style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
              />
              <TextInput
                placeholder="Search restaurants or food..."
                placeholderTextColor="#657c69"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="w-full rounded-xl border border-[#e5e7eb] bg-white py-3 pl-10 pr-4 text-sm text-[#1a2e1f]"
                style={{ fontSize: 14 }}
              />
            </View>
            <TouchableOpacity className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white">
              <Ionicons name="options-outline" size={20} color="#657c69" />
            </TouchableOpacity>
          </View>

          {/* View Mode Toggle and Categories */}
          <View className="flex justify-center flex-row items-center mt-6">
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />

            {/* Categories - Only show in list mode */}
            {viewMode === "list" && (
              <View className="flex-1">
                <CategoryFilters
                  categories={categoryFilterOptions}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </View>
            )}
          </View>

          {/* List View Content */}
          <Suspense fallback={<ListingsLoadingFallback />}>
            <ListingsList
              queryParams={queryParams}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              tabBarHeight={tabBarHeight}
              userLocation={userLocation}
            />
          </Suspense>
        </View>
      )}
    </>
  );
}

export default function HomeScreen() {
  return (
    <CustomSafeAreaView>
      <DiscoverContent />
    </CustomSafeAreaView>
  );
}
