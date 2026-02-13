import { IUserRole } from "@/features/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface OnboardingData {
  // Step 1: Role Selection
  role: IUserRole;

  // Step 2: Personal Information
  fullName: string;
  phoneNumber: string;

  // Step 3: Location
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Step 4: Preferences (Consumer only)
  dietaryPreferences: string[];
  favoriteCuisines: string[];
  budgetRange: string;

  // Restaurant-specific fields
  restaurantName?: string;
  cuisineType?: string;
  operatingHours?: string;
  restaurantAddress?: string; // JSON string of address data from map picker
}

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
  isOnboardingComplete: () => Promise<boolean>;
  getRole: () => IUserRole | undefined;
  getStoredRole: () => Promise<IUserRole | undefined>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = "@clean_plate:onboarding";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

  // Load stored onboarding data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setOnboardingData(data);
      }
    } catch (error) {
      console.error("Error loading stored onboarding data:", error);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          ...onboardingData,
          completed: true,
          completedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      throw error;
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      setOnboardingData({});
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  const isOnboardingComplete = async (): Promise<boolean> => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.completed === true;
      }
      return false;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  };

  const getRole = (): IUserRole | undefined => {
    return onboardingData.role;
  };

  const getStoredRole = async (): Promise<IUserRole | undefined> => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.role;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting stored role:", error);
      return undefined;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        completeOnboarding,
        resetOnboarding,
        isOnboardingComplete,
        getRole,
        getStoredRole,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
