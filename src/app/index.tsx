import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";

export default function Index() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before navigating
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Use setTimeout to ensure navigation happens after render
      const timer = setTimeout(() => {
        router.replace("/(auth)/login");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

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
