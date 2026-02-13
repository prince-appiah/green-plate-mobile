import React from "react";
import { Text } from "react-native";

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return <Text className="text-lg font-bold text-[#1a2e1f] mb-3">{title}</Text>;
}
