import { useGetPublicListings } from "@/features/listings/hooks/use-public-listings";
import { GetPublicListingsQuery } from "@/features/listings/services/listings-types";
import React from "react";
import { MapView } from ".";

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

export function MapListings({
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
  const { data: listingsResponse } = useGetPublicListings(queryParams);
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
