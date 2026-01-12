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
    postalCode?: string;
  };
  openingHours: {
    dayOfWeek: string;
    open: string | null;
    close: string | null;
  }[];
}

export interface RestaurantOnboardingResponse {}

export interface CustomerOnboardingPayload {
  dietary: string[];
  radiusKm: number;
}

export interface CustomerOnboardingResponse {}
