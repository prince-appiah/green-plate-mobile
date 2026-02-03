import { BackButton } from "@/components/back-button";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

interface ReservationHeaderProps {
  imageUrl: string;
  statusBadge: React.ReactNode;
}

export function ReservationHeader({ imageUrl, statusBadge }: ReservationHeaderProps) {
  return (
    <>
      {/* Back button */}
      <View className="absolute top-12 left-4 z-10">
        <BackButton onPress={() => router.push("/(consumers)/bookings")} />
      </View>

      {/* Image Section */}
      <View className="relative h-80">
        <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
          }}
        />

        {/* Status Badge */}
        <View className="absolute top-12 right-4">{statusBadge}</View>
      </View>
    </>
  );
}
