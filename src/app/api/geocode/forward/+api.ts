import { BaseApiResponse } from "@/lib/axios";

/**
 * Forward geocoding API route
 * Converts address to coordinates (latitude, longitude)
 *
 * POST /api/geocode/forward
 * Body: { address: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    // Validate input
    if (typeof address !== "string" || !address.trim()) {
      return Response.json(
        {
          success: false,
          message: "Invalid request. Address must be a non-empty string.",
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
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Google Maps API HTTP error: ${response.status} ${response.statusText}`
      );
      return Response.json(
        {
          success: false,
          message: "Failed to geocode address.",
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
        address,
        error_message: data.error_message || "No error message",
      });
    }

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const coordinates = {
        latitude: location.lat,
        longitude: location.lng,
      };

      return Response.json({
        success: true,
        message: "Address geocoded successfully",
        data: coordinates,
        timestamp: new Date(),
      } as BaseApiResponse<{ latitude: number; longitude: number }>);
    }

    // Handle specific error statuses
    if (data.status === "ZERO_RESULTS") {
      return Response.json(
        {
          success: false,
          message: "No coordinates found for the provided address.",
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
          message: "Invalid geocoding request. Check address format.",
          data: null,
          timestamp: new Date(),
        } as BaseApiResponse<null>,
        { status: 400 }
      );
    }

    // For any other status
    console.warn(
      `Geocoding API returned status: ${data.status} for address:`,
      address
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
    console.error("Error in forward geocoding API route:", error);
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
