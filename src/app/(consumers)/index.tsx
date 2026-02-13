import {
  DiscoveryCategoryFilterBar,
  DiscoveryHeroSection,
  DiscoverySearchBar,
  ListingsList,
  ListingsLoadingFallback,
  MapListings,
} from "@/components/screens/consumers/discovery-screen";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useDiscoveryScreen } from "@/features/listings/hooks/use-discovery-screen";
import { capitalizeFirstLetter, ListingCategories } from "@/features/shared";
import React, { Suspense } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DiscoverContent() {
  const insets = useSafeAreaInsets();
  const {
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    showNearMe,
    handleToggleNearMe,
    userLocation,
    isLoadingLocation,
    hasLocationPermission,
    queryParams,
  } = useDiscoveryScreen();

  // Calculate bottom padding for tab bar
  const tabBarHeight = Platform.OS === "ios" ? 60 + Math.max(insets.bottom, 8) : 60 + Math.max(insets.bottom, 8);

  // Create category filter options
  const categoryFilterOptions = [
    { label: "All", value: "all" },
    ...ListingCategories.map((category) => ({
      label: capitalizeFirstLetter(category),
      value: category,
    })),
  ];

  return (
    <>
      {/* Hero Section - Only show in list mode */}
      {viewMode === "list" && <DiscoveryHeroSection />}

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
              <DiscoveryCategoryFilterBar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                categories={categoryFilterOptions}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </View>
          </View>

          {/* Search and Filter - Overlay on Map (Below Toggle) */}
          <View
            style={{
              position: "absolute",
              top: insets.top + 60,
              left: 16,
              right: 16,
              zIndex: 10,
            }}
          >
            <DiscoverySearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </View>
        </>
      ) : (
        <View className="px-4 grow pt-4 space-y-4">
          {/* Search and Filter */}
          <DiscoverySearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* View Mode Toggle and Categories */}
          <DiscoveryCategoryFilterBar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={categoryFilterOptions}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

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
