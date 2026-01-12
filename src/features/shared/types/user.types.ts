const USER_ROLES = {
  CONSUMER: "consumer",
  RESTAURANT: "restaurantOwner",
  ADMIN: "admin",
} as const;

export const USER_ROLES_VALUES = Object.values(USER_ROLES);

export const USER_ROLES_KEYS = Object.keys(USER_ROLES);

export const USER_ROLES_MAP = Object.fromEntries(
  Object.entries(USER_ROLES).map(([key, value]) => [value, key])
);
export type IUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: IUserRole;
  lastLoginAt: Date;
  isActive: boolean;
  onboardingCompleted: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Consumer extends BaseUser {
  preferences?: {
    dietary: string[];
    radiusKm: number;
    favoriteRestaurantIds: string[];
  };
  favoriteCuisines?: string[];
  points?: number;
}

export interface Restaurant {
  name: string; // TODO: Change all name to restaurantName
  description?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    postalCode: number;
    country: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  openingHours: {
    dayOfWeek: string;
    open: string;
    close: string;
  }[];
}

export type User = Consumer | Restaurant;
