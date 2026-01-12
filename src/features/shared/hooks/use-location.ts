import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert, Platform } from "react-native";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useLocation(options: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === "granted");
      return status === "granted";
    } catch (err) {
      console.error("Error checking location permission:", err);
      setHasPermission(false);
      return false;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);

      if (!granted) {
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions in your device settings to use this feature.",
          [{ text: "OK" }]
        );
      }

      return granted;
    } catch (err) {
      console.error("Error requesting location permission:", err);
      setError("Failed to request location permission");
      setHasPermission(false);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission first (same approach as MapPicker)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        setIsLoading(false);
        Alert.alert(
          "Location Permission Required",
          "Please enable location permissions in your device settings to use this feature.",
          [{ text: "OK" }]
        );
        return null;
      }

      setHasPermission(true);

      // Get current location with Balanced accuracy for better real-world location
      // Using maximumAge: 0 to ensure we get fresh location data from the device
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 0, // Always get fresh location, don't use cached
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || undefined,
      };

      // Log location for debugging (verify it's real device location)
      console.log("Device location retrieved:", {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        timestamp: new Date().toISOString(),
      });

      setLocation(locationData);
      setIsLoading(false);
      return locationData;
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to get current location";
      console.error("Error getting location:", errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      
      // Show user-friendly error
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please make sure location services are enabled and try again.",
        [{ text: "OK" }]
      );
      
      return null;
    }
  };

  const watchPosition = (
    callback: (location: LocationData) => void
  ): (() => void) | null => {
    if (!hasPermission) {
      requestPermission().then((granted) => {
        if (!granted) return null;
      });
    }

    const subscription = Location.watchPositionAsync(
      {
        accuracy:
          options.enableHighAccuracy !== false
            ? Location.Accuracy.Balanced
            : Location.Accuracy.Low,
        ...options,
      },
      (location) => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined,
        };
        setLocation(locationData);
        callback(locationData);
      }
    );

    return () => {
      subscription.then((sub) => sub.remove());
    };
  };

  return {
    location,
    isLoading,
    error,
    hasPermission,
    getCurrentLocation,
    requestPermission,
    watchPosition,
  };
}
