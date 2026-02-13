import { UpdateListingPayload } from "@/features/listings";
import { Listing } from "@/features/shared";
import { format } from "date-fns";
import { Alert } from "react-native";

/**
 * Extract time string from Date or ISO string
 */
export const extractTimeString = (time: Date | string): string => {
  const date = typeof time === "string" ? new Date(time) : time;
  return format(date, "HH:mm");
};

/**
 * Create update payload for pausing a listing (set isVisible to false)
 */
export const createPauseListingPayload = (listing: Listing): UpdateListingPayload => {
  const startTime = extractTimeString(listing.pickup.startTime);
  const endTime = extractTimeString(listing.pickup.endTime);

  return {
    listingId: listing.id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    originalPrice: listing.originalPrice,
    discountedPrice: listing.discountedPrice,
    currency: listing.currency,
    quantityTotal: listing.quantityTotal,
    maxPerUser: listing.maxPerUser,
    pickup: {
      startTime,
      endTime,
      location: {
        coordinates: listing.pickup.location.coordinates,
      },
      instructions: listing.pickup.instructions,
    },
    isVisible: false, // Hide from consumers
  };
};

/**
 * Create update payload for activating a listing (set isVisible to true)
 */
export const createActivateListingPayload = (listing: Listing): UpdateListingPayload => {
  const startTime = extractTimeString(listing.pickup.startTime);
  const endTime = extractTimeString(listing.pickup.endTime);

  return {
    listingId: listing.id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    originalPrice: listing.originalPrice,
    discountedPrice: listing.discountedPrice,
    currency: listing.currency,
    quantityTotal: listing.quantityTotal,
    maxPerUser: listing.maxPerUser,
    pickup: {
      startTime,
      endTime,
      location: {
        coordinates: listing.pickup.location.coordinates,
      },
      instructions: listing.pickup.instructions,
    },
    isVisible: true, // Show to consumers
  };
};

/**
 * Handle pause listing action with error handling
 */
export const handlePauseListingAction = async (
  listing: Listing | null,
  updateMutation: (payload: UpdateListingPayload) => Promise<any>,
  onSuccess: () => void,
) => {
  if (!listing) {
    Alert.alert("Error", "Could not find listing data");
    return;
  }

  const payload = createPauseListingPayload(listing);

  try {
    const response = await updateMutation(payload);
    if (response.success) {
      Alert.alert("Success", "Listing paused successfully");
      onSuccess();
    } else {
      Alert.alert("Error", response.message || "Failed to pause listing");
    }
  } catch (error) {
    console.error("Error pausing listing:", error);
    Alert.alert("Error", error instanceof Error ? error.message : "Failed to pause listing. Please try again.");
  }
};

/**
 * Handle activate listing action with error handling
 */
export const handleActivateListingAction = async (
  listing: Listing | null,
  updateMutation: (payload: UpdateListingPayload) => Promise<any>,
  onSuccess: () => void,
) => {
  if (!listing) {
    Alert.alert("Error", "Could not find listing data");
    return;
  }

  const payload = createActivateListingPayload(listing);

  try {
    const response = await updateMutation(payload);
    if (response.success) {
      Alert.alert("Success", "Listing activated successfully");
      onSuccess();
    } else {
      Alert.alert("Error", response.message || "Failed to activate listing");
    }
  } catch (error) {
    console.error("Error activating listing:", error);
    Alert.alert("Error", error instanceof Error ? error.message : "Failed to activate listing. Please try again.");
  }
};
