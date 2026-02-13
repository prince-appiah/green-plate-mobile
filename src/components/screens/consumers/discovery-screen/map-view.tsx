import { GetPublicListingsResponse } from "@/features/listings/services/listings-types";
import { calculateDiscountPercentage } from "@/features/shared";
import { getFormattedDistance } from "@/lib/distance";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import RNMapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { MapCards } from "./map-cards";
import { NearMeToggle } from "./near-me-toggle";
import { UserLocationPill } from "./user-location-pill";

interface MapViewListing {
  id: string;
  latitude: number;
  longitude: number;
  restaurantName: string;
  distance: string;
  rating: string;
  reviews: string;
  categories: string[];
  itemName: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  timeRange: string;
  itemsLeft: string;
  imageUrl: string;
  isFavorited: boolean;
  isSoldOut: boolean;
}

interface MapViewProps {
  listings: GetPublicListingsResponse[];
  favorites: string[];
  tabBarHeight: number;
  onToggleFavorite: (id: string) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  isLoadingLocation?: boolean;
  showNearMe: boolean;
  onToggleNearMe: () => void;
  hasLocationPermission?: boolean;
}

export function MapView({
  listings,
  favorites,
  tabBarHeight,
  onToggleFavorite,
  userLocation,
  isLoadingLocation = false,
  showNearMe,
  onToggleNearMe,
  hasLocationPermission,
}: MapViewProps) {
  const mapRef = useRef<RNMapView>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Default region (San Francisco) as fallback
  const defaultRegion: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Transform listings to MapView format
  const mapListings = useMemo<MapViewListing[]>(() => {
    return listings.map((listing) => {
      // Extract coordinates from GeoJSON format [longitude, latitude]
      const [longitude, latitude] = listing.pickup.location.coordinates;
      const discount = calculateDiscountPercentage(listing.originalPrice, listing.discountedPrice);
      const isSoldOut = listing.quantityAvailable === 0;

      // Calculate distance if user location is available
      let distance = "0.0 mi";
      if (userLocation) {
        distance = getFormattedDistance(userLocation.latitude, userLocation.longitude, latitude, longitude, "mi");
      }

      return {
        id: listing.id,
        latitude,
        longitude,
        restaurantName: listing.restaurant.name,
        distance,
        rating: "4.5", // TODO: Add rating to API response
        reviews: "0", // TODO: Add reviews count to API response
        categories: [listing.category],
        itemName: listing.title,
        currentPrice: `$${listing.discountedPrice.toFixed(2)}`,
        originalPrice: `$${listing.originalPrice.toFixed(2)}`,
        discount: `-${discount}%`,
        timeRange: `${new Date(listing.pickup.startTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })} - ${new Date(listing.pickup.endTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}`,
        itemsLeft: listing.quantityAvailable.toString(),
        imageUrl: listing.photoUrls?.[0] || "",
        isFavorited: favorites.includes(listing.id),
        isSoldOut,
      };
    });
  }, [listings, favorites, userLocation]);

  // Calculate initial region to fit all markers or center on user location
  // Always returns a valid region to ensure map always renders
  const initialRegion = useMemo<Region>(() => {
    // Priority 1: Use user location if available
    if (
      userLocation &&
      typeof userLocation.latitude === "number" &&
      typeof userLocation.longitude === "number" &&
      !isNaN(userLocation.latitude) &&
      !isNaN(userLocation.longitude)
    ) {
      console.log("Using user location for map region:", userLocation);
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    // Priority 2: Calculate bounds from listings if available
    if (mapListings.length > 0) {
      const latitudes = mapListings.map((l) => l.latitude).filter((lat) => !isNaN(lat));
      const longitudes = mapListings.map((l) => l.longitude).filter((lon) => !isNaN(lon));

      if (latitudes.length > 0 && longitudes.length > 0) {
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLon = Math.min(...longitudes);
        const maxLon = Math.max(...longitudes);

        const latDelta = (maxLat - minLat) * 1.5 || 0.0922;
        const lonDelta = (maxLon - minLon) * 1.5 || 0.0421;

        const region = {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLon + maxLon) / 2,
          latitudeDelta: Math.max(latDelta, 0.0922),
          longitudeDelta: Math.max(lonDelta, 0.0421),
        };
        console.log("Using listings bounds for map region:", region);
        return region;
      }
    }

    // Priority 3: Default fallback region (San Francisco)
    console.log("Using default fallback region (San Francisco)");
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [mapListings, userLocation]);

  // Fit map to show all markers when listings change
  useEffect(() => {
    if (mapListings.length > 0 && mapRef.current) {
      const coordinates = mapListings.map((listing) => ({
        latitude: listing.latitude,
        longitude: listing.longitude,
      }));

      if (userLocation) {
        coordinates.push({ latitude: userLocation.latitude, longitude: userLocation.longitude });
      }

      // Small delay to ensure map is rendered
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          });
        }
      }, 300);
    }
  }, [mapListings, userLocation]);

  const handleMarkerPress = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <RNMapView
        ref={mapRef}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
        mapType="standard"
        // loadingEnabled={true}
        onMapReady={() => {
          console.log("Map ready, initial region:", initialRegion);
          // Fit to coordinates when map is ready
          if (mapListings.length > 0 && mapRef.current) {
            const coordinates = mapListings.map((listing) => ({
              latitude: listing.latitude,
              longitude: listing.longitude,
            }));

            if (userLocation) {
              coordinates.push({ latitude: userLocation.latitude, longitude: userLocation.longitude });
            }

            setTimeout(() => {
              mapRef.current?.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
                animated: true,
              });
            }, 100);
          } else if (userLocation && mapRef.current) {
            // If we have user location but no listings, center on user location
            mapRef.current.animateToRegion(
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              1000,
            );
          }
        }}
      >
        {mapListings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={{
              latitude: listing.latitude,
              longitude: listing.longitude,
            }}
            onPress={() => handleMarkerPress(listing.id)}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerPin, listing.isSoldOut && styles.markerPinSoldOut]}>
                <Ionicons name={listing.isSoldOut ? "restaurant" : "leaf"} size={18} color="#ffffff" />
              </View>
              {!listing.isSoldOut && (
                <View style={styles.markerBadge}>
                  <Text style={styles.markerBadgeText}>{listing.discount}</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </RNMapView>

      {/* User Location Pill */}
      <UserLocationPill isLoading={isLoadingLocation} hasLocation={!!userLocation} />

      {/* Near Me Toggle - Positioned below location pill */}
      <NearMeToggle
        isEnabled={showNearMe}
        onToggle={onToggleNearMe}
        hasPermission={hasLocationPermission}
        isLoading={isLoadingLocation}
      />

      {/* Bottom Cards Sheet */}
      <MapCards
        listings={mapListings}
        favorites={favorites}
        tabBarHeight={tabBarHeight}
        onToggleFavorite={onToggleFavorite}
        selectedListingId={selectedListingId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerPinSoldOut: {
    backgroundColor: "#9ca3af",
  },
  markerBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  markerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
  },
});
