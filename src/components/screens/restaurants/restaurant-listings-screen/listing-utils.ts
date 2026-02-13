import { getListingDiscount, getListingPickupTime, getListingQuantitySold, Listing } from "@/features/shared";

/**
 * Map API Listing to RestaurantListing format for UI display
 */
export const mapListingToRestaurantListing = (listing: Listing) => {
  const discount = getListingDiscount(listing.originalPrice, listing.discountedPrice);
  const quantitySold = getListingQuantitySold(listing.quantityTotal, listing.quantityAvailable);
  const pickupTime = getListingPickupTime(listing.pickup.startTime, listing.pickup.endTime);

  // Map status from API format to UI format
  const statusMap: Record<string, "active" | "paused" | "sold_out" | "expired"> = {
    active: "active",
    paused: "paused",
    soldOut: "sold_out",
    expired: "expired",
    pending: "paused", // Map pending to paused for display
  };

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    imageUrl: listing.photoUrls[0] || "",
    originalPrice: listing.originalPrice,
    currentPrice: listing.discountedPrice,
    discount,
    quantity: listing.quantityTotal,
    quantitySold,
    pickupTime,
    status: statusMap[listing.status] || "paused",
    createdAt: listing.createdAt.toString(),
    category: listing.category,
    isVisible: listing.isVisible,
  };
};

export type RestaurantListing = ReturnType<typeof mapListingToRestaurantListing>;

/**
 * Get status color for listing status
 */
export const getStatusColor = (status: "active" | "paused" | "sold_out" | "expired") => {
  switch (status) {
    case "active":
      return "#16a34a";
    case "paused":
      return "#f59e0b";
    case "sold_out":
      return "#ef4444";
    case "expired":
      return "#6b7280";
    default:
      return "#6b7280";
  }
};

/**
 * Get status label for listing status
 */
export const getStatusLabel = (status: "active" | "paused" | "sold_out" | "expired") => {
  switch (status) {
    case "active":
      return "Active";
    case "paused":
      return "Paused";
    case "sold_out":
      return "Sold Out";
    case "expired":
      return "Expired";
    default:
      return status;
  }
};
