import * as FileSystem from "expo-file-system/legacy";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

export interface ImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  maxWidth?: number;
  compress?: number;
  format?: SaveFormat;
}

export interface ImagePickerResult {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

const DEFAULT_OPTIONS: Required<ImagePickerOptions> = {
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
  maxWidth: 800,
  compress: 0.8,
  format: SaveFormat.JPEG,
};

export function useImagePicker(options: Partial<ImagePickerOptions> = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  /**
   * Request camera and media library permissions
   */
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
        Alert.alert("Permission Required", "We need camera and photo library permissions to upload images.");
        return false;
      }
      return true;
    } catch (err) {
      setError("Failed to request permissions");
      return false;
    }
  };

  /**
   * Convert image URI to base64 string
   */
  const convertToBase64 = async (
    uri: string,
    compress?: number,
    maxWidth?: number,
    format?: SaveFormat,
  ): Promise<string> => {
    try {
      let imageUri = uri;

      // Optionally resize/compress the image
      if (maxWidth || compress !== undefined) {
        const manipulatedImage = await manipulateAsync(uri, maxWidth ? [{ resize: { width: maxWidth } }] : [], {
          compress: compress ?? mergedOptions.compress,
          format: format ?? mergedOptions.format,
        });
        imageUri = manipulatedImage.uri;
      }

      // Read file and convert to base64 using legacy FileSystem API
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Return base64 string with data URI prefix
      const mimeType = format === SaveFormat.PNG ? "image/png" : "image/jpeg";
      return `data:${mimeType};base64,${base64}`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to convert image";
      throw new Error(errorMessage);
    }
  };

  /**
   * Pick image from camera
   */
  const pickFromCamera = async (includeBase64 = false): Promise<ImagePickerResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
      });

      if (result.canceled || !result.assets[0]) {
        setIsLoading(false);
        return null;
      }

      const asset = result.assets[0];
      const imageResult: ImagePickerResult = {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      };

      if (includeBase64) {
        imageResult.base64 = await convertToBase64(
          asset.uri,
          mergedOptions.compress,
          mergedOptions.maxWidth,
          mergedOptions.format,
        );
      }

      setIsLoading(false);
      return imageResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to pick image from camera";
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert("Error", errorMessage);
      return null;
    }
  };

  /**
   * Pick image from gallery
   */
  const pickFromGallery = async (includeBase64 = false): Promise<ImagePickerResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
      });

      if (result.canceled || !result.assets[0]) {
        setIsLoading(false);
        return null;
      }

      const asset = result.assets[0];
      const imageResult: ImagePickerResult = {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      };

      if (includeBase64) {
        imageResult.base64 = await convertToBase64(
          asset.uri,
          mergedOptions.compress,
          mergedOptions.maxWidth,
          mergedOptions.format,
        );
      }

      setIsLoading(false);
      return imageResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to pick image from gallery";
      setError(errorMessage);
      setIsLoading(false);
      Alert.alert("Error", errorMessage);
      return null;
    }
  };

  /**
   * Show action sheet to choose between camera and gallery
   */
  const pickImage = async (includeBase64 = false): Promise<ImagePickerResult | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        "Select Photo",
        "Choose an option",
        [
          {
            text: "Camera",
            onPress: async () => {
              const result = await pickFromCamera(includeBase64);
              resolve(result);
            },
          },
          {
            text: "Photo Library",
            onPress: async () => {
              const result = await pickFromGallery(includeBase64);
              resolve(result);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) },
      );
    });
  };

  /**
   * Convert existing image URI to base64
   */
  const convertUriToBase64 = async (uri: string): Promise<string> => {
    return convertToBase64(uri, mergedOptions.compress, mergedOptions.maxWidth, mergedOptions.format);
  };

  return {
    pickImage,
    pickFromCamera,
    pickFromGallery,
    convertUriToBase64,
    requestPermissions,
    isLoading,
    error,
  };
}
