import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewStyle } from "react-native";

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  className?: string;
}

export const SkeletonLoader = ({
  width = "100%",
  height = 40,
  borderRadius = 8,
  className = "",
}: SkeletonLoaderProps) => {
  const style: ViewStyle = {
    width: typeof width === "string" ? undefined : width,
    height: typeof height === "string" ? undefined : height,
    borderRadius,
    flex: typeof width === "string" && width === "100%" ? 1 : undefined,
  };

  return (
    <View style={style} className={width === "100%" ? "w-full" : ""}>
      <LinearGradient
        colors={["#e5e7eb", "#f3f4f6", "#e5e7eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          height: typeof height === "string" ? undefined : height,
          borderRadius,
        }}
      />
    </View>
  );
};

interface SkeletonInputProps extends SkeletonLoaderProps {
  label?: boolean;
}

export const SkeletonInput = ({ label = true, height = 50, ...props }: SkeletonInputProps) => {
  return (
    <View className="mb-4">
      {label && (
        <View className="mb-2">
          <View style={{ width: "40%" }}>
            <SkeletonLoader height={16} borderRadius={4} />
          </View>
        </View>
      )}
      <SkeletonLoader height={height} borderRadius={8} {...props} />
    </View>
  );
};

interface SkeletonTextProps extends SkeletonLoaderProps {
  lines?: number;
}

export const SkeletonText = ({ lines = 1, height = 16, ...props }: SkeletonTextProps) => {
  return (
    <View className="gap-2">
      {Array.from({ length: lines }).map((_, index) => {
        const isLastLine = index === lines - 1;
        return (
          <View
            key={index}
            style={{
              width: isLastLine ? "80%" : "100%",
            }}
          >
            <SkeletonLoader height={height} borderRadius={4} {...props} />
          </View>
        );
      })}
    </View>
  );
};

interface SkeletonMapProps {
  height?: number;
}

export const SkeletonMap = ({ height = 300 }: SkeletonMapProps) => {
  return (
    <View className="mb-4">
      <View className="mb-2">
        <View style={{ width: "40%" }}>
          <SkeletonLoader height={16} borderRadius={4} />
        </View>
      </View>
      <SkeletonLoader height={height} borderRadius={8} />
    </View>
  );
};
