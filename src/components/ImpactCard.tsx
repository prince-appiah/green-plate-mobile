import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImpactCardProps {
  mealsSaved: number;
  co2PreventedKg: number;
}

export default function ImpactCard({
  mealsSaved = 0,
  co2PreventedKg = 0,
}: ImpactCardProps) {
  return (
    <View className="bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-2xl p-5 border border-[#16a34a]/20 shadow-sm">
      <Text className="text-sm font-semibold text-white/90 mb-4">
        Your Impact
      </Text>

      <View className="flex-row gap-4">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 items-center justify-center rounded-2xl bg-white/20">
            <Ionicons name="leaf" size={24} color="#ffffff" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-white">{mealsSaved}</Text>
            <Text className="text-xs text-white/80">Meals Saved</Text>
          </View>
        </View>

        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 items-center justify-center rounded-2xl bg-white/20">
            <Ionicons name="water" size={24} color="#ffffff" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-white">
              {co2PreventedKg.toFixed(1)}
            </Text>
            <Text className="text-xs text-white/80">kg CO₂ Saved</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
