import { StyledImage } from "@/components/ui/image";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

const heroImagePlaceholder = "../../../../assets/images/hero_food.jpg";

/**
 * Hero section for discovery screen
 * Only shown in list view mode
 */
export function DiscoveryHeroSection() {
  return (
    <View className="relative h-44 overflow-hidden">
      <StyledImage source={Asset.fromModule(require(heroImagePlaceholder))} className="h-full w-full object-cover" />
      <LinearGradient
        colors={["rgba(239, 242, 240, 0)", "rgba(239, 242, 240, 0.6)", "rgba(239, 242, 240, 1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View className="absolute bottom-4 left-4 right-4">
        <Text className="text-xl font-bold mb-1 text-[#1a2e1f]">Save food today 🌿</Text>
        <Text className="text-sm text-[#657c69]">Rescue delicious surplus from nearby restaurants</Text>
      </View>
    </View>
  );
}
