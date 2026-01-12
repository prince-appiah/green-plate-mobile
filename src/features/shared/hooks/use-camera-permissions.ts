import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

export function useCameraPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      return granted;
    } catch (err) {
      console.error("Error checking camera permission:", err);
      setHasPermission(false);
      return false;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);

      if (!granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera permissions in your device settings to scan QR codes.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }

      setIsLoading(false);
      return granted;
    } catch (err) {
      console.error("Error requesting camera permission:", err);
      setHasPermission(false);
      setIsLoading(false);
      Alert.alert(
        "Error",
        "Failed to request camera permission. Please try again."
      );
      return false;
    }
  };

  return {
    hasPermission,
    isLoading,
    requestPermission,
    checkPermission,
  };
}
