import "../global.css";

import { AuthEventListener } from "@/components/AuthEventListener";
import ErrorBoundary from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Slot } from "expo-router";
import { Platform } from "react-native";
import AsyncStorageDevTools from "react-native-async-storage-devtools";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { useSyncQueriesExternal } from "react-query-external-sync";
import { AuthProvider } from "../contexts/AuthContext";
import { OnboardingProvider } from "../contexts/OnboardingContext";

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
    // <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OnboardingProvider>
            <SafeAreaProvider>
              <AuthEventListener />
              <ErrorBoundary>
                <Slot />
                <PortalHost />
                <AsyncStorageDevTools />
              </ErrorBoundary>
            </SafeAreaProvider>
          </OnboardingProvider>
        </AuthProvider>
      </QueryClientProvider>
    // </GestureHandlerRootView>
  );
}
