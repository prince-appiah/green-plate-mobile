import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface FoodCardProps {
  imageUrl: string;
  restaurantName: string;
  distance: string;
  rating: string;
  reviews: string;
  categories: string[];
  itemName: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  timeRange: string;
  itemsLeft: string;
  isFavorited?: boolean;
  onFavoritePress?: () => void;
  onPress?: () => void;
}

export default function FoodCard({
  imageUrl,
  restaurantName,
  distance,
  rating,
  reviews,
  categories,
  itemName,
  currentPrice,
  originalPrice,
  discount,
  timeRange,
  itemsLeft,
  isFavorited = false,
  onFavoritePress,
  onPress,
}: FoodCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback placeholder image
  const placeholderImage =
    "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";

  const CardWrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress, activeOpacity: 0.9 } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className="bg-white border-2 border-[rgba(22,163,74,0.2)] rounded-3xl shadow-lg mb-4 overflow-hidden"
    >
      {/* Image Section */}
      <View className="relative h-40">
        <Image
          source={{ uri: imageError ? placeholderImage : imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Time Badge */}
        <View className="absolute top-3 left-3 bg-[rgba(220,252,231,0.9)] rounded-2xl px-2.5 py-1 flex-row items-center">
          <Ionicons
            name="time-outline"
            size={12}
            color="#14532d"
            style={{ marginRight: 4 }}
          />
          <Text className="text-[#14532d] text-xs font-bold">{timeRange}</Text>
        </View>

        {/* Discount Badge */}
        <View className="absolute top-3 right-3 bg-[#16a34a] rounded-full w-11 h-11 items-center justify-center shadow-md">
          <Text className="text-white text-sm font-bold">{discount}</Text>
        </View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
          }}
        />
      </View>

      {/* Content Section */}
      <View className="p-4">
        {/* Restaurant Info */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-[#1a2e1f] text-lg font-bold mb-1">
              {restaurantName}
            </Text>
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-2">
                <Ionicons
                  name="location-outline"
                  size={12}
                  color="#657c69"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[#657c69] text-xs">{distance}</Text>
              </View>
              <View className="w-1 h-1 bg-[#d1d5dc] rounded-full mx-1" />
              <View className="flex-row items-center">
                <Ionicons
                  name="star"
                  size={12}
                  color="#fbbf24"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[#657c69] text-xs">
                  {rating} ({reviews})
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={onFavoritePress}
            className="w-6 h-6 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={isFavorited ? "#ef4444" : "#657c69"}
            />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="flex-row flex-wrap mb-3">
          {categories.map((category, index) => (
            <View
              key={index}
              className="bg-[rgba(220,252,231,0.4)] rounded-2xl px-2 py-1 mr-2 mb-1"
            >
              <Text className="text-[#14532d] text-xs font-medium">
                {category}
              </Text>
            </View>
          ))}
        </View>

        {/* Magic Bag Section */}
        <View className="bg-[rgba(220,252,231,0.3)] border border-[#dcfce7] rounded-2xl p-3">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[#1a2e1f] text-sm font-bold mb-1">
                {itemName}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-[#16a34a] text-base font-bold mr-2">
                  {currentPrice}
                </Text>
                <Text className="text-[#657c69] text-xs line-through">
                  {originalPrice}
                </Text>
              </View>
            </View>
            <View className="bg-[rgba(22,163,74,0.1)] rounded-2xl px-3 py-1.5">
              <Text className="text-[#16a34a] text-xs font-bold">
                {itemsLeft} left
              </Text>
            </View>
          </View>
        </View>
      </View>
    </CardWrapper>
  );
}
