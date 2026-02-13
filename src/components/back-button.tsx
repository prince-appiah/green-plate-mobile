import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

interface BackButtonProps {
  className?: string;
  onPress?: () => void;
}

export const BackButton = ({ onPress, className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => router.back()}
      className={cn("w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-md", className)}
    >
      <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
    </TouchableOpacity>
  );
};
