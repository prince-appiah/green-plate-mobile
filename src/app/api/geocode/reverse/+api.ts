import { AddressData } from "@/components/MapPicker";
import { BaseApiResponse } from "@/lib/axios";

/**
 * Reverse geocoding API route
 * Converts coordinates (latitude, longitude) to address
 *
 * POST /api/geocode/reverse
 * Body: { latitude: number, longitude: number }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    // Validate input
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return Response.json(
        {
          success: false,
          message: "Invalid request. Latitude and longitude must be numbers.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
    if (!apiKey) {
      console.error("Google Maps API key not configured on server");
      return Response.json(
        {
          success: false,
          message: "Geocoding service not configured.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 500 }
      );
    }

    // Call Google Maps Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Google Maps API HTTP error: ${response.status} ${response.statusText}`
      );
      return Response.json(
        {
          success: false,
          message: "Failed to geocode location.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log API response status for debugging
    if (data.status !== "OK") {
      console.warn(`Google Maps Geocoding API status: ${data.status}`, {
        latitude,
        longitude,
        error_message: data.error_message || "No error message",
      });
    }

    // Handle different status codes
    if (data.status === "OK" && data.results && data.results.length > 0) {
      // Find the most specific result (prefer results with street addresses)
      let result = data.results[0];

      // Try to find a result with a street address
      const resultWithStreet = data.results.find((r: any) =>
        r.address_components?.some(
          (c: any) =>
            c.types.includes("street_number") || c.types.includes("route")
        )
      );
      if (resultWithStreet) {
        result = resultWithStreet;
      }

      const addressComponents = result.address_components || [];
      const formattedAddress = result.formatted_address || "";

      let street = "";
      let city = "";
      let state = "";
      let country = "";
      let postalCode = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (types.includes("street_number")) {
          street = component.long_name + " ";
        }
        if (types.includes("route")) {
          street += component.long_name;
        }
        if (types.includes("locality")) {
          city = component.long_name;
        }
        // Also check for sublocality if locality is not available
        if (!city && types.includes("sublocality")) {
          city = component.long_name;
        }
        // Check for sublocality_level_1 as fallback
        if (!city && types.includes("sublocality_level_1")) {
          city = component.long_name;
        }
        // Check for administrative_area_level_2 (county) as city fallback
        if (!city && types.includes("administrative_area_level_2")) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (types.includes("country")) {
          country = component.long_name;
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      // If we don't have a street, try to extract from formatted_address
      if (!street.trim() && formattedAddress) {
        const parts = formattedAddress.split(",");
        // First part is usually the street address
        street = parts[0]?.trim() || "";
      }

      // If we don't have a city, try to get it from formatted_address
      if (!city && formattedAddress) {
        const parts = formattedAddress.split(",");
        // Usually the second-to-last part is the city (before country)
        if (parts.length > 1) {
          city = parts[parts.length - 2]?.trim() || "";
        }
      }

      // If we still don't have a city, try administrative_area_level_2 or other levels
      if (!city) {
        const cityComponent = addressComponents.find(
          (c: any) =>
            c.types.includes("administrative_area_level_2") ||
            c.types.includes("administrative_area_level_3")
        );
        if (cityComponent) {
          city = cityComponent.long_name;
        }
      }

      // Return address data even if some fields are missing
      const addressData: AddressData = {
        street:
          street.trim() || formattedAddress.split(",")[0]?.trim() || "Location",
        city: city || "",
        country: country || "",
        coordinates: [longitude, latitude], // [longitude, latitude] format
        postalCode: postalCode || undefined,
        state: state || undefined,
      };

      return Response.json({
        success: true,
        message: "Address geocoded successfully",
        data: addressData,
        timestamp: new Date(),
      } as BaseApiResponse<AddressData>);
    }

    // Handle specific error statuses
    if (data.status === "ZERO_RESULTS") {
      return Response.json(
        {
          success: false,
          message: "No address found for the provided coordinates.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 404 }
      );
    }

    if (data.status === "REQUEST_DENIED") {
      console.error(
        "Geocoding API request denied. Check API key permissions and restrictions."
      );
      return Response.json(
        {
          success: false,
          message: "Geocoding service access denied.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 403 }
      );
    }

    if (data.status === "OVER_QUERY_LIMIT") {
      console.error("Geocoding API quota exceeded.");
      return Response.json(
        {
          success: false,
          message: "Geocoding service quota exceeded.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 429 }
      );
    }

    if (data.status === "INVALID_REQUEST") {
      return Response.json(
        {
          success: false,
          message: "Invalid geocoding request. Check coordinates format.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 400 }
      );
    }

    // For any other status
    console.warn(
      `Geocoding API returned status: ${data.status} for coordinates:`,
      latitude,
      longitude
    );
    return Response.json(
      {
        success: false,
        message: `Geocoding failed with status: ${data.status}`,
        data: null,
        timestamp: new Date(),
      } as BaseApiResponse<null>,
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in reverse geocoding API route:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during geocoding.",
        data: null,
        timestamp: new Date(),
      } as BaseApiResponse<null>,
      { status: 500 }
    );
  }
}
