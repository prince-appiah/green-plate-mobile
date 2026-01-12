# Maps Integration Setup Guide

This guide will help you set up Google Maps integration for the Clean Plate app.

## Prerequisites

1. Google Cloud Platform account
2. Google Maps API key with the following APIs enabled:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory (if it doesn't exist) and add:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Important Notes:** 
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` is used for native map SDKs (Android/iOS) and is exposed to the client
- `GOOGLE_MAPS_API_KEY` is **server-only** and used by Expo Router API routes for geocoding
  - This keeps the API key secure on the server side
  - Never expose this key to the client
  - For production builds, configure this in your deployment environment

## Step 3: Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your API key
3. Under "Application restrictions":
   - For Android: Add your package name: `com.cleanplate.app`
   - For iOS: Add your bundle identifier: `com.cleanplate.app`
4. Under "API restrictions":
   - Restrict to: Maps SDK for Android, Maps SDK for iOS, Geocoding API

## Step 4: Rebuild the App

After setting up the API key, you need to rebuild the native apps:

### For Android:
```bash
npx expo prebuild --clean
npx expo run:android
```

### For iOS:
```bash
npx expo prebuild --clean
npx expo run:ios
```

## Step 5: Verify Setup

1. The app should now display maps correctly
2. Location permissions will be requested when needed
3. Geocoding (address lookup) will work when API key is configured

## Troubleshooting

### Maps not showing:
- Verify API key is set correctly in `.env`
- Check that Maps SDK APIs are enabled in Google Cloud Console
- Rebuild the app after adding the API key
- Check console for API key errors

### Location not working:
- Ensure location permissions are granted in device settings
- Check that `expo-location` is properly installed
- Verify permissions are configured in `app.json`

### Geocoding not working:
- Verify Geocoding API is enabled in Google Cloud Console
- Check `GOOGLE_MAPS_API_KEY` is set in your `.env` file (server-side only)
- Verify the API key has access to Geocoding API
- Check that Expo Router API routes are working (`/api/geocode/reverse` and `/api/geocode/forward`)
- Check server console logs for API errors
- Note: Geocoding now goes through Expo Router API routes, not directly from the client

## Features

The maps integration includes:

1. **MapView Component**: Displays interactive maps with markers
2. **MapPicker Component**: Allows users to select locations on a map
3. **Geocoding Service**: Converts coordinates to addresses and vice versa
   - Uses Expo Router API routes (`/api/geocode/reverse` and `/api/geocode/forward`)
   - API key is kept secure on the server side
4. **Location Hook**: Gets user's current location with permission handling

## Architecture

### Geocoding Flow

The geocoding service uses Expo Router API routes to keep the Google Maps API key secure:

```
Client (GeocodingService) 
  → Expo Router API Route (/api/geocode/reverse or /api/geocode/forward)
    → Google Maps Geocoding API (with server-side API key)
      → Response back through API route
        → Client receives formatted data
```

This architecture ensures:
- API key never exposed to the client
- Can add rate limiting, caching, or other server-side logic
- Consistent error handling
- Better security and control

## Usage Examples

### Get Current Location:
```typescript
import { useLocation } from "@/features/shared";

const { location, getCurrentLocation, hasPermission } = useLocation();

// Request location
await getCurrentLocation();
```

### Reverse Geocode (Coordinates to Address):
```typescript
import { geocodingService } from "@/features/shared";

const address = await geocodingService.reverseGeocode(latitude, longitude);
```

### Geocode (Address to Coordinates):
```typescript
import { geocodingService } from "@/features/shared";

const coordinates = await geocodingService.geocode("123 Main St, San Francisco, CA");
```

