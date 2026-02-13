import { IUserRole } from "@/features/shared";

export enum OnboardingStage {
  NOT_STARTED = "not_started",
  ROLE_SELECTED = "role_selected",
  PROFILE_COMPLETED = "profile_completed",
  COMPLETED = "completed",
}

export interface OnboardingStatusResponse {
  stage: OnboardingStage;
  role: IUserRole;
  roleSelected: boolean;
  roleSelectedAt: Date;
  profileCompleted: boolean;
  profileCompletedAt: Date;
  preferencesCompleted: boolean;
  preferencesCompletedAt: Date;
  onboardingCompleted: boolean;
  onboardingCompletedAt: Date;
  nextStep: string;
}

export interface RestaurantOnboardingPayload {
  name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    country: string;
    coordinates: [number, number];
    postalCode?: number;
  };
  openingHours: {
    dayOfWeek: string;
    open: string | null;
    close: string | null;
  }[];
}

export interface RestaurantOnboardingResponse {}

export interface SubmitCustomerBasicInfoPayload {
  phoneNumber: string;
}

export interface SubmitCustomerBasicInfoResponse {
  success: boolean;
}

export interface SubmitCustomerPreferencesPayload {
  dietary: string[];
  location: {
    longitude: number;
    latitude: number;
  };
  // budgetRange: 'low' |'medium' |'high' // for now we are not using this, add in version 2
  // favoriteCuisines: string[]
}

export interface SubmitCustomerPreferencesResponse {
  success: boolean;
}
