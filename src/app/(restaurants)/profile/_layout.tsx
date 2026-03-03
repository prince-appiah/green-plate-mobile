import { Stack } from "expo-router";
import React from "react";

export default function RestaurantProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[userId]/index" options={{ headerShown: false }} />
    </Stack>
  );
}
