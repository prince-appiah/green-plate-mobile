import { GetPublicListingsQuery } from "@/features/listings/services/listings-types";
import { ListingCategory, useLocation } from "@/features/shared";
import React, { useMemo } from "react";

/**
 * Custom hook for managing discovery screen state and logic
 * Handles search, filters, view mode, favorites, and location
 */
export function useDiscoveryScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"list" | "map">("list");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [showNearMe, setShowNearMe] = React.useState(false);

  // Location hook
  const {
    location: userLocation,
    isLoading: isLoadingLocation,
    hasPermission: hasLocationPermission,
    getCurrentLocation,
    requestPermission,
  } = useLocation();

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query parameters for API
  const queryParams = useMemo<GetPublicListingsQuery>(() => {
    const params: GetPublicListingsQuery = {};

    if (selectedCategory && selectedCategory !== "all" && selectedCategory.trim() !== "") {
      params.category = selectedCategory as ListingCategory;
    }

    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }

    if (showNearMe && userLocation) {
      params.latitude = userLocation.latitude;
      params.longitude = userLocation.longitude;
      params.radiusKm = 10;
    }

    return params;
  }, [selectedCategory, debouncedSearchQuery, showNearMe, userLocation]);

  const handleToggleNearMe = async () => {
    if (!showNearMe) {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        setShowNearMe(true);
        await getCurrentLocation();
      }
    } else {
      setShowNearMe(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]));
  };

  return {
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    showNearMe,
    handleToggleNearMe,
    userLocation,
    isLoadingLocation,
    hasLocationPermission,
    queryParams,
  };
}
