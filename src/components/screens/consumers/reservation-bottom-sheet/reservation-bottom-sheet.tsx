import { GetPublicListingByIdResponse } from "@/features/listings/services/listings-types";
import { useReservationForm } from "@/features/reservations/hooks/use-reservation-form";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ListingInfoSection, PickupInfoSection, PriceSummary, QuantitySelector } from ".";

interface ReservationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  listing: GetPublicListingByIdResponse | null;
  onSuccess?: () => void;
}

export default function ReservationBottomSheet({ visible, onClose, listing, onSuccess }: ReservationBottomSheetProps) {
  const {
    quantity,
    maxQuantity,
    unitPrice,
    totalPrice,
    isPending,
    canIncrement,
    canDecrement,
    handleIncrement,
    handleDecrement,
    handleReserve,
  } = useReservationForm({ listing, visible, onClose, onSuccess });

  if (!listing) return null;

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
            <ListingInfoSection
              title={listing.title}
              unitPrice={unitPrice}
              quantityAvailable={listing.quantityAvailable}
            />

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              maxQuantity={maxQuantity}
              canIncrement={canIncrement}
              canDecrement={canDecrement}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />

            {/* Price Summary */}
            <PriceSummary quantity={quantity} unitPrice={unitPrice} totalPrice={totalPrice} />

            {/* Pickup Information */}
            <PickupInfoSection
              startTime={listing.pickup.startTime}
              endTime={listing.pickup.endTime}
              instructions={listing.pickup.instructions}
            />
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
