import { BackButton } from "@/components/back-button";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

interface ListingImageHeaderProps {
  imageUrl: string;
  discount: string;
  timeRange: string;
}

/**
 * Header section with listing image, discount badge, and time badge
 * Includes back button overlay
 */
export function ListingImageHeader({ imageUrl, discount, timeRange }: ListingImageHeaderProps) {
  return (
    <>
      {/* Back button */}
      <View className="absolute top-12 left-4 z-10">
        <BackButton onPress={() => router.back()} />
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

        {/* Discount Badge */}
        <View className="absolute top-12 right-4 bg-[#16a34a] rounded-full w-16 h-16 items-center justify-center shadow-lg">
          <Text className="text-white text-lg font-bold">{discount}</Text>
        </View>

        {/* Time Badge */}
        <View className="absolute bottom-4 left-4 bg-[rgba(220,252,231,0.9)] rounded-2xl px-3 py-2 flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#14532d" style={{ marginRight: 6 }} />
          <Text className="text-[#14532d] text-sm font-bold">{timeRange}</Text>
        </View>
      </View>
    </>
  );
}
