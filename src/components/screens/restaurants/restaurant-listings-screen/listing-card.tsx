import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { RestaurantListing, getStatusColor, getStatusLabel } from "./listing-utils";

interface ListingCardProps {
  listing: RestaurantListing;
  onEdit: () => void;
  onPause: () => void;
  onActivate: () => void;
  isUpdating: boolean;
}

export function ListingCard({ listing, onEdit, onPause, onActivate, isUpdating }: ListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const placeholderImage = "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const statusColor = getStatusColor(listing.status);
  const statusLabel = getStatusLabel(listing.status);
  const availableQuantity = listing.quantity - listing.quantitySold;

  return (
    <View className="bg-white border-2 border-[rgba(22,163,74,0.2)] rounded-3xl shadow-lg mb-4 overflow-hidden">
      {/* Image Section */}
      <View className="relative h-40">
        <Image
          source={{ uri: imageError ? placeholderImage : listing.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Status Badge */}
        <View
          className="absolute top-3 left-3 rounded-2xl px-3 py-1.5 flex-row items-center"
          style={{ backgroundColor: `${statusColor}20` }}
        >
          <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: statusColor }} />
          <Text className="text-xs font-bold" style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>

        {/* Discount Badge */}
        <View className="absolute top-3 right-3 bg-[#16a34a] rounded-full w-11 h-11 items-center justify-center shadow-md">
          <Text className="text-white text-sm font-bold">-{listing.discount}%</Text>
        </View>

        {/* Quantity Badge */}
        <View className="absolute bottom-3 left-3 bg-[rgba(220,252,231,0.9)] rounded-2xl px-2.5 py-1 flex-row items-center">
          <Ionicons name="cube-outline" size={12} color="#14532d" style={{ marginRight: 4 }} />
          <Text className="text-[#14532d] text-xs font-bold">{availableQuantity} left</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4">
        <Text className="text-lg font-bold text-[#1a2e1f] mb-1">{listing.title}</Text>
        <Text className="text-sm text-[#657c69] mb-3" numberOfLines={2}>
          {listing.description}
        </Text>

        {/* Price and Stats */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-[#16a34a]">${listing.currentPrice.toFixed(2)}</Text>
            <Text className="text-sm text-[#657c69] line-through ml-2">${listing.originalPrice.toFixed(2)}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#657c69" />
            <Text className="text-xs text-[#657c69] ml-1">{listing.pickupTime}</Text>
          </View>
        </View>

        {/* Sales Info */}
        <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-[#e5e7eb]">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text className="text-sm text-[#657c69] ml-2">{listing.quantitySold} sold</Text>
          </View>
          <Text className="text-xs text-[#657c69]">{listing.category}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          {/* Only show pause/activate for listings that aren't sold out or expired */}
          {listing.status !== "sold_out" &&
            listing.status !== "expired" &&
            (listing.isVisible ? (
              <TouchableOpacity
                onPress={onPause}
                disabled={isUpdating}
                className={`flex-1 bg-[#fef3c7] rounded-xl py-2.5 flex-row items-center justify-center ${
                  isUpdating ? "opacity-50" : ""
                }`}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#f59e0b" />
                ) : (
                  <>
                    <Ionicons name="pause" size={16} color="#f59e0b" />
                    <Text className="text-[#f59e0b] font-semibold text-sm ml-1">Pause</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onActivate}
                disabled={isUpdating}
                className={`flex-1 bg-[#dcfce7] rounded-xl py-2.5 flex-row items-center justify-center ${
                  isUpdating ? "opacity-50" : ""
                }`}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#16a34a" />
                ) : (
                  <>
                    <Ionicons name="play" size={16} color="#16a34a" />
                    <Text className="text-[#16a34a] font-semibold text-sm ml-1">Activate</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          <TouchableOpacity
            onPress={onEdit}
            disabled={isUpdating}
            className={`flex-1 bg-[#eff2f0] rounded-xl py-2.5 flex-row items-center justify-center ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <Ionicons name="create-outline" size={16} color="#657c69" />
            <Text className="text-[#657c69] font-semibold text-sm ml-1">Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
