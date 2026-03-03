import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure routing logic runs only after first mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Wait for initial mount and auth loading to finish
    if (!isMounted || isLoading) return;

    // Navigate based on auth state
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    const targetRoute = user.role === "restaurantOwner" ? "/(restaurants)" : "/(consumers)";

    router.replace(targetRoute);
  }, [user, isLoading, isMounted, router]);

  return (
    <CustomSafeAreaView
      useSafeArea
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eff2f0",
      }}
    >
      <ActivityIndicator size="large" color="#16a34a" />
    </CustomSafeAreaView>
  );
}
