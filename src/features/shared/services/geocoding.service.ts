import { AddressData } from "@/components/MapPicker";
import { BaseApiResponse } from "@/lib/axios";

/**
 * Geocoding service to convert coordinates to addresses
 * Uses Expo Router API routes which proxy to Google Maps Geocoding API
 *
 * API Routes:
 * - POST /api/geocode/reverse - Convert coordinates to address
 * - POST /api/geocode/forward - Convert address to coordinates
 *
 * Requirements:
 * - Geocoding API must be enabled in Google Cloud Console
 * - API key must be configured server-side (GOOGLE_MAPS_API_KEY env var)
 * - API key must have Geocoding API permissions
 */
class GeocodingService {
  private static instance: GeocodingService;

  public static getInstance(): GeocodingService {
    if (!GeocodingService.instance) {
      GeocodingService.instance = new GeocodingService();
    }
    return GeocodingService.instance;
  }

  /**
   * Get the base URL for API requests
   * Uses current origin for relative URLs
   */
  private getApiBaseUrl(): string {
    // For web, use current origin
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    // For native (React Native), use relative URL which will work with Expo Router
    // Expo Router handles relative URLs correctly in native contexts
    // In development, this will use the Metro bundler server
    // In production, this will use the deployed server URL
    return "";
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<AddressData | null> {
    try {
      const baseUrl = this.getApiBaseUrl();
      const url = `${baseUrl}/api/geocode/reverse`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        console.error(
          `Geocoding API HTTP error: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const data = (await response.json()) as BaseApiResponse<AddressData>;

      if (data.success && data.data) {
        return data.data;
      }

      // Log error message if available
      if (data.message) {
        console.warn(`Geocoding failed: ${data.message}`);
      }

      return null;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return null;
    }
  }

  /**
   * Geocode address to coordinates
   */
  async geocode(
    address: string
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const baseUrl = this.getApiBaseUrl();
      const url = `${baseUrl}/api/geocode/forward`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        console.error(
          `Geocoding API HTTP error: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const data = (await response.json()) as BaseApiResponse<{
        latitude: number;
        longitude: number;
      }>;

      if (data.success && data.data) {
        return data.data;
      }

      // Log error message if available
      if (data.message) {
        console.warn(`Geocoding failed: ${data.message}`);
      }

      return null;
    } catch (error) {
      console.error("Error geocoding:", error);
      return null;
    }
  }
}

export const geocodingService = GeocodingService.getInstance();
