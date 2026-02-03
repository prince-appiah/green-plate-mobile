import ImpactCard from "@/components/ImpactCard";
import React from "react";
import { View } from "react-native";
import { SectionHeader } from "./section-header";

interface ImpactSectionProps {
  mealsSaved: number;
  co2PreventedKg: number;
}

export function ImpactSection({ mealsSaved, co2PreventedKg }: ImpactSectionProps) {
  return (
    <View className="mb-6">
      <SectionHeader title="Environmental Impact" />
      <ImpactCard mealsSaved={mealsSaved} co2PreventedKg={co2PreventedKg} />
    </View>
  );
}
