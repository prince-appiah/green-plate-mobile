import "../global.css";

import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";
import { OnboardingProvider } from "../contexts/OnboardingContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import Constants from "expo-constants";
import { useSyncQueriesExternal } from "react-query-external-sync";
import { Platform } from "react-native";
import { enableScreens } from "react-native-screens";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthEventListener } from "@/components/AuthEventListener";
import ErrorBoundary from "@/components/ErrorBoundary";

// Get the host IP address dynamically
const hostIP = Constants.expoGoConfig?.debuggerHost?.split(`:`)[0] || Constants.expoConfig?.hostUri?.split(`:`)[0];

export default function Layout() {
  enableScreens();
  useSyncQueriesExternal({
    queryClient,
    socketURL: `http://${hostIP}:42831`,
    deviceName: Platform?.OS || "web",
    platform: Platform?.OS || "web",
    deviceId: Platform?.OS || "web",
    isDevice: Device.isDevice,
    asyncStorage: AsyncStorage,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OnboardingProvider>
          <SafeAreaProvider>
            <AuthEventListener />
            <ErrorBoundary>
              <Slot />
            </ErrorBoundary>
          </SafeAreaProvider>
        </OnboardingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
