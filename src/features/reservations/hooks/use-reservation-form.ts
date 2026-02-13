import type { GetPublicListingByIdResponse } from "@/features/listings/services/listings-types";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useCreateReservation } from "./use-reservations";

interface UseReservationFormOptions {
  listing: GetPublicListingByIdResponse | null;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing reservation form state and logic
 * Handles quantity selection, validation, and reservation creation
 */
export const useReservationForm = ({ listing, visible, onClose, onSuccess }: UseReservationFormOptions) => {
  const [quantity, setQuantity] = useState(1);
  const { mutate: createReservation, isPending } = useCreateReservation();

  // Reset quantity when modal opens/closes
  useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible]);

  if (!listing) {
    return {
      quantity,
      maxQuantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      isPending: false,
      canIncrement: false,
      canDecrement: false,
      handleIncrement: () => {},
      handleDecrement: () => {},
      handleReserve: () => {},
    };
  }

  const maxQuantity = Math.min(listing.quantityAvailable, listing.maxPerUser);
  const unitPrice = listing.discountedPrice;
  const totalPrice = unitPrice * quantity;
  const canIncrement = quantity < maxQuantity && !isPending;
  const canDecrement = quantity > 1 && !isPending;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleIncrement = () => handleQuantityChange(1);
  const handleDecrement = () => handleQuantityChange(-1);

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
            ],
          );
        },
        onError: (error: any) => {
          Alert.alert(
            "Reservation Failed",
            error?.response?.data?.message || error?.message || "Failed to create reservation. Please try again.",
          );
        },
      },
    );
  };

  return {
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
  };
};
