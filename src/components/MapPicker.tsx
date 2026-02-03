import { geocodingService } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region } from "react-native-maps";
import CustomSafeAreaView from "./ui/SafeAreaView/safe-area-view";

export interface AddressData {
  street?: string;
  city?: string;
  country?: string;
  coordinates: [number, number]; // [longitude, latitude]
  postalCode?: number;
  state?: string;
}

interface MapPickerProps {
  onLocationSelect: (addressData: AddressData) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  inline?: boolean; // If true, show map inline instead of in modal
  height?: number; // Height for inline map (default: 300)
}

export default function MapPicker({ onLocationSelect, initialLocation, inline = false, height = 400 }: MapPickerProps) {
  const [isMapReady, setIsMapReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialLocation || null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const mapRef = useRef<MapView>(null);
  const lastLoadedLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const isLoadingRef = useRef(false);

  function handleOnMapReady() {
    setIsMapReady(true);
  }

  useEffect(() => {
    if (initialLocation) {
      // Check if this is the same location we already loaded
      const lastLoaded = lastLoadedLocationRef.current;
      const isSameLocation =
        lastLoaded &&
        Math.abs(lastLoaded.latitude - initialLocation.latitude) < 0.0001 &&
        Math.abs(lastLoaded.longitude - initialLocation.longitude) < 0.0001;

      // Only load if it's a different location and we're not already loading
      if (!isSameLocation && !isLoadingRef.current) {
        setSelectedLocation(initialLocation);
        loadAddressForLocation(initialLocation.latitude, initialLocation.longitude);
      } else if (isSameLocation) {
        // If it's the same location, just update selectedLocation without reloading
        setSelectedLocation(initialLocation);
      }
    }
  }, [initialLocation]);

  // For inline mode, automatically get location when component mounts
  useEffect(() => {
    if (inline && !initialLocation && !selectedLocation && !hasRequestedLocation && !isLoadingLocation) {
      // Small delay to ensure map is ready
      const timer = setTimeout(() => {
        setHasRequestedLocation(true);
        getCurrentLocation();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inline, initialLocation]);

  useEffect(() => {
    if (modalVisible && !selectedLocation && !isLoadingLocation) {
      // Always try to get current location when modal opens (only if no initial location)
      if (!initialLocation) {
        getCurrentLocation();
      }
    }
  }, [modalVisible]);

  // Get default region - use user location if available, otherwise use a reasonable default
  const getDefaultRegion = (): Region => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    if (selectedLocation) {
      return {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    // Use a reasonable default (San Francisco area) instead of world map
    // This ensures the map loads properly even before location is obtained
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  const loadAddressForLocation = async (latitude: number, longitude: number) => {
    // Prevent duplicate calls for the same location
    const lastLoaded = lastLoadedLocationRef.current;
    const isSameLocation =
      lastLoaded &&
      Math.abs(lastLoaded.latitude - latitude) < 0.0001 &&
      Math.abs(lastLoaded.longitude - longitude) < 0.0001;

    if (isSameLocation && addressData) {
      // Already loaded this location, skip
      return;
    }

    if (isLoadingRef.current) {
      // Already loading, skip
      return;
    }

    isLoadingRef.current = true;
    setIsLoadingAddress(true);

    try {
      const address = await geocodingService.reverseGeocode(latitude, longitude);

      // Update the ref to track this location as loaded
      lastLoadedLocationRef.current = { latitude, longitude };

      if (address) {
        setAddressData(address);
        // Only call onLocationSelect if the address coordinates actually changed
        // This prevents the retrigger loop
        const addressChanged =
          !addressData ||
          Math.abs(addressData.coordinates[0] - address.coordinates[0]) > 0.0001 ||
          Math.abs(addressData.coordinates[1] - address.coordinates[1]) > 0.0001;

        if (inline && addressChanged) {
          onLocationSelect(address);
        }
      } else {
        // If geocoding returns null, clear address data
        setAddressData(null);
        if (!inline) {
          Alert.alert(
            "Address Not Available",
            "Unable to get address for this location. Please try selecting a different location.",
            [{ text: "OK" }],
          );
        }
      }
    } catch (error) {
      console.error("Error loading address:", error);
      setAddressData(null);
      if (!inline) {
        Alert.alert("Error", "Failed to load address for this location. Please try again.", [{ text: "OK" }]);
      }
    } finally {
      setIsLoadingAddress(false);
      isLoadingRef.current = false;
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions in your device settings to use this feature.",
          [{ text: "OK" }],
        );
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      // Store user location for default region
      const newLocation = { latitude, longitude };
      setUserLocation(newLocation);
      setSelectedLocation(newLocation);

      // Load address for the location
      await loadAddressForLocation(latitude, longitude);

      // Animate map to current location
      if (mapRef.current) {
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        mapRef.current.animateToRegion(region, 1000);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please make sure location services are enabled and try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation = { latitude, longitude };
    setSelectedLocation(newLocation);
    loadAddressForLocation(latitude, longitude);

    // Animate map to selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500,
      );
    }
  };

  const handleMarkerDragEnd = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation = { latitude, longitude };
    setSelectedLocation(newLocation);
    loadAddressForLocation(latitude, longitude);
  };

  const handleConfirm = () => {
    if (addressData && selectedLocation) {
      onLocationSelect(addressData);
      setModalVisible(false);
    } else {
      Alert.alert(
        "Location Required",
        "Please select a location on the map or use the location button to get your current location.",
        [{ text: "OK" }],
      );
    }
  };

  const displayText = addressData
    ? `${addressData.street || "Unknown"}, ${addressData.city || "Unknown"}, ${addressData.country || "Unknown"}`
    : selectedLocation
      ? "Tap to select location"
      : "Select location on map";

  // Render inline map view
  if (inline) {
    return (
      <View>
        {/* Map Container */}
        <View className="relative rounded-xl overflow-hidden border border-[#e5e7eb]" style={{ height }}>
          <MapView
            key="inline-map"
            ref={mapRef}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            style={StyleSheet.absoluteFillObject}
            initialRegion={getDefaultRegion()}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
            // loadingEnabled={false}
            mapType="satellite"
            onMapReady={handleOnMapReady}
            // onMapReady={() => {
            //   console.log("Map ref loaded:", mapRef.current);
            //   console.log("Map loaded, initial region:", getDefaultRegion());

            //   // When map is ready, animate to user location if available
            //   if (mapRef.current && userLocation) {
            //     mapRef.current.animateToRegion(
            //       {
            //         latitude: userLocation.latitude,
            //         longitude: userLocation.longitude,
            //         latitudeDelta: 0.0922,
            //         longitudeDelta: 0.0421,
            //       },
            //       500
            //     );
            //   } else if (mapRef.current && selectedLocation) {
            //     // Or animate to selected location if available
            //     mapRef.current.animateToRegion(
            //       {
            //         latitude: selectedLocation.latitude,
            //         longitude: selectedLocation.longitude,
            //         latitudeDelta: 0.0922,
            //         longitudeDelta: 0.0421,
            //       },
            //       500
            //     );
            //   }
            // }}
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
                draggable
                onDragEnd={handleMarkerDragEnd}
                pinColor="#16a34a"
              />
            )}
          </MapView>

          {/* Loading overlay when getting location - only show briefly */}
          {isLoadingLocation && !selectedLocation && !userLocation && (
            <View className="absolute inset-0 bg-black/10 items-center justify-center z-10">
              <View className="bg-white rounded-2xl px-6 py-4 items-center shadow-lg">
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="text-sm text-[#1a2e1f] mt-3 font-medium">Getting your location...</Text>
              </View>
            </View>
          )}

          {/* Get Current Location Button */}
          <View className="absolute top-4 right-4 z-10">
            <TouchableOpacity
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
              className="bg-white rounded-full p-3 shadow-lg"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#16a34a" />
              ) : (
                <Ionicons name="locate" size={24} color="#16a34a" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Address Info */}
        <View className="bg-white rounded-xl border border-[#e5e7eb] px-4 py-3 mt-3">
          {isLoadingAddress ? (
            <View className="flex-row items-center py-2">
              <ActivityIndicator size="small" color="#16a34a" />
              <Text className="text-sm text-[#657c69] ml-2">Loading address...</Text>
            </View>
          ) : addressData ? (
            <>
              <Text className="text-sm font-semibold text-[#1a2e1f] mb-1">Selected Address</Text>
              <Text className="text-sm text-[#657c69]">{addressData.street || "Street not available"}</Text>
              <Text className="text-sm text-[#657c69]">
                {addressData.city || "City not available"}
                {addressData.state && `, ${addressData.state}`}
                {addressData.postalCode && ` ${addressData.postalCode}`}
              </Text>
              <Text className="text-sm text-[#657c69]">{addressData.country || "Country not available"}</Text>
              <Text className="text-xs text-[#9ca3af] mt-2">Tap on the map or drag the marker to change location</Text>
            </>
          ) : (
            <Text className="text-sm text-[#657c69]">Select a location on the map</Text>
          )}
        </View>
      </View>
    );
  }

  // Render modal-based map picker (original behavior)
  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white rounded-xl border border-[#e5e7eb] px-4 h-14 flex-row items-center"
      >
        <Ionicons name="map-outline" size={20} color="#657c69" style={{ marginRight: 12 }} />
        <Text className={`flex-1 text-base ${addressData ? "text-[#1a2e1f]" : "text-[#9ca3af]"}`} numberOfLines={1}>
          {displayText}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#657c69" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-[#eff2f0]">
          {/* Header */}
          <View className="bg-white px-6 pt-12 pb-4 flex-row items-center justify-between border-b border-[#e5e7eb]">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#1a2e1f" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-[#1a2e1f]">Select Location</Text>
            <TouchableOpacity onPress={handleConfirm} disabled={!addressData}>
              <Text className={`text-base font-semibold ${addressData ? "text-[#16a34a]" : "text-[#9ca3af]"}`}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map */}
          <CustomSafeAreaView useSafeArea className="grow  ">
            <MapView
              ref={mapRef}
              provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              style={StyleSheet.absoluteFillObject}
              initialRegion={
                selectedLocation
                  ? {
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }
                  : getDefaultRegion()
              }
              region={
                selectedLocation
                  ? {
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }
                  : getDefaultRegion()
              }
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={false}
              mapType="standard"
              loadingEnabled={true}
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                  pinColor="#16a34a"
                />
              )}
            </MapView>

            {/* Get Current Location Button */}
            <View className="absolute top-4 right-4 z-10">
              <TouchableOpacity
                onPress={getCurrentLocation}
                disabled={isLoadingLocation}
                className="bg-white rounded-full p-3 shadow-lg"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color="#16a34a" />
                ) : (
                  <Ionicons name="locate" size={24} color="#16a34a" />
                )}
              </TouchableOpacity>
            </View>

            {/* Loading overlay when getting location */}
            {isLoadingLocation && (
              <View className="absolute inset-0 bg-black/20 items-center justify-center z-20">
                <View className="bg-white rounded-2xl px-6 py-4 items-center shadow-lg">
                  <ActivityIndicator size="large" color="#16a34a" />
                  <Text className="text-sm text-[#1a2e1f] mt-3 font-medium">Getting your location...</Text>
                </View>
              </View>
            )}
          </CustomSafeAreaView>

          {/* Address Info */}
          <View className="bg-white px-6 py-4 border-t border-[#e5e7eb]">
            {isLoadingAddress ? (
              <View className="flex-row items-center py-2">
                <ActivityIndicator size="small" color="#16a34a" />
                <Text className="text-sm text-[#657c69] ml-2">Loading address...</Text>
              </View>
            ) : addressData ? (
              <>
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">Selected Address</Text>
                <Text className="text-sm text-[#657c69]">{addressData.street || "Street not available"}</Text>
                <Text className="text-sm text-[#657c69]">
                  {addressData.city || "City not available"}
                  {addressData.state && `, ${addressData.state}`}
                  {addressData.postalCode && ` ${addressData.postalCode}`}
                </Text>
                <Text className="text-sm text-[#657c69]">{addressData.country || "Country not available"}</Text>
                <Text className="text-xs text-[#9ca3af] mt-2">
                  Tap on the map or drag the marker to change location
                </Text>
              </>
            ) : (
              <Text className="text-sm text-[#657c69]">Select a location on the map</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
