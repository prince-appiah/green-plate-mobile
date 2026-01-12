const LISTING_STATUSES = {
  ACTIVE: "active",
  PAUSED: "paused",
  SOLD_OUT: "soldOut",
  EXPIRED: "expired",
  PENDING: "pending",
  // CANCELLED:"cancelled",
  // COMPLETED:"completed",
  // REFUNDED:"refunded",
  // REFUND_REQUESTED:"refundRequested",
  // REFUND_APPROVED:"refundApproved",
  // REFUND_REJECTED:"refundRejected",
} as const;

const LISTING_CATEGORIES = {
  PREPARED: "prepared",
  PACKAGED: "packaged",
  FRESH: "fresh",
  BULK: "bulk",
  FOOD: "food",
  DRINK: "drink",
  OTHER: "other",
} as const;

export const ListingStatuses = Object.values(LISTING_STATUSES);
export type ListingStatus =
  (typeof LISTING_STATUSES)[keyof typeof LISTING_STATUSES];

export const ListingCategories = Object.values(LISTING_CATEGORIES);
export type ListingCategory =
  (typeof LISTING_CATEGORIES)[keyof typeof LISTING_CATEGORIES];

export interface Listing {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  category: ListingCategory;
  photoUrls: string[];
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  quantityTotal: number;
  quantityAvailable: number;
  maxPerUser: number;
  pickup: {
    startTime: Date;
    endTime: Date;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
    instructions: string;
  };
  status: ListingStatus;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
