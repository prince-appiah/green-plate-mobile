import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateReservation } from "@/features/reservations";
import { GetPublicListingByIdResponse } from "@/features/listings/services/listings-types";
import { formatCurrency, formatTimeRange } from "@/features/shared";

interface ReservationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  listing: GetPublicListingByIdResponse | null;
  onSuccess?: () => void;
}

export default function ReservationBottomSheet({ visible, onClose, listing, onSuccess }: ReservationBottomSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const { mutate: createReservation, isPending } = useCreateReservation();

  // Reset quantity when modal opens/closes
  useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible]);

  if (!listing) return null;

  const maxQuantity = Math.min(listing.quantityAvailable, listing.maxPerUser);
  const unitPrice = listing.discountedPrice;
  const totalPrice = unitPrice * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleReserve = () => {
    if (quantity < 1 || quantity > maxQuantity) {
      Alert.alert("Invalid Quantity", "Please select a valid quantity.");
      return;
    }

    createReservation(
      {
        listingId: listing.id,
        quantity,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Reservation Successful!",
            "Your reservation has been confirmed. You can view it in your bookings.",
            [
              {
                text: "OK",
                onPress: () => {
                  onClose();
                  onSuccess?.();
                },
              },
            ]
          );
        },
        onError: (error: any) => {
          Alert.alert(
            "Reservation Failed",
            error?.response?.data?.message || error?.message || "Failed to create reservation. Please try again."
          );
        },
      }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-4 border-b border-[#e5e7eb]">
            <Text className="text-xl font-bold text-[#1a2e1f]">Make Reservation</Text>
            <TouchableOpacity onPress={onClose} disabled={isPending} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#657c69" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
            {/* Listing Info */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-[#1a2e1f] mb-2">{listing.title}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-[#657c69]">{formatCurrency(unitPrice)} per item</Text>
                <View className="bg-[rgba(22,163,74,0.1)] rounded-xl px-3 py-1">
                  <Text className="text-[#16a34a] text-sm font-semibold">{listing.quantityAvailable} available</Text>
                </View>
              </View>
            </View>

            {/* Quantity Selector */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Quantity</Text>
              <View className="flex-row items-center justify-between bg-[rgba(220,252,231,0.3)] rounded-2xl p-4 border border-[#dcfce7]">
                <TouchableOpacity
                  onPress={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isPending}
                  className={`w-10 h-10 items-center justify-center rounded-full ${
                    quantity <= 1 || isPending ? "bg-gray-200" : "bg-[#16a34a]"
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color={quantity <= 1 || isPending ? "#9CA3AF" : "#ffffff"} />
                </TouchableOpacity>

                <View className="items-center">
                  <Text className="text-3xl font-bold text-[#1a2e1f]">{quantity}</Text>
                  <Text className="text-sm text-[#657c69] mt-1">Max: {maxQuantity}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity || isPending}
                  className={`w-10 h-10 items-center justify-center rounded-full ${
                    quantity >= maxQuantity || isPending ? "bg-gray-200" : "bg-[#16a34a]"
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={quantity >= maxQuantity || isPending ? "#9CA3AF" : "#ffffff"} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Summary */}
            <View className="mb-6 bg-[rgba(220,252,231,0.3)] rounded-2xl p-4 border border-[#dcfce7]">
              <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Price Summary</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-[#657c69]">
                    {quantity} × {formatCurrency(unitPrice)}
                  </Text>
                  <Text className="text-[#657c69]">{formatCurrency(unitPrice * quantity)}</Text>
                </View>
                <View className="border-t border-[#dcfce7] pt-2 mt-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-[#1a2e1f]">Total</Text>
                    <Text className="text-2xl font-bold text-[#16a34a]">{formatCurrency(totalPrice)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Pickup Information */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-[#1a2e1f] mb-3">Pickup Information</Text>
              <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4">
                <View className="flex-row items-start mb-3">
                  <Ionicons name="time-outline" size={20} color="#16a34a" style={{ marginRight: 12, marginTop: 2 }} />
                  <View className="flex-1">
                    <Text className="text-sm text-[#657c69] mb-1">Pickup Time</Text>
                    <Text className="text-base font-semibold text-[#1a2e1f]">
                      {formatTimeRange(listing.pickup.startTime, listing.pickup.endTime)}
                    </Text>
                  </View>
                </View>
                {listing.pickup.instructions && (
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#16a34a"
                      style={{ marginRight: 12, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="text-sm text-[#657c69] mb-1">Instructions</Text>
                      <Text className="text-base text-[#1a2e1f]">{listing.pickup.instructions}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer with Reserve Button */}
          <View className="px-4 py-4 border-t border-[#e5e7eb] bg-white">
            <TouchableOpacity
              onPress={handleReserve}
              disabled={isPending || quantity < 1 || quantity > maxQuantity}
              className={`bg-[#16a34a] rounded-2xl py-4 items-center justify-center ${
                isPending || quantity < 1 || quantity > maxQuantity ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-lg font-bold">Confirm Reservation</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
