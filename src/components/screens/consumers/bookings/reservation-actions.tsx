import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ReservationActionsProps {
  canCancel: boolean;
  isCancelling: boolean;
  onCancel: () => void;
  listingId?: string;
}

export function ReservationActions({ canCancel, isCancelling, onCancel, listingId }: ReservationActionsProps) {
  return (
    <>
      {/* Cancel Button */}
      {canCancel && (
        <TouchableOpacity
          onPress={onCancel}
          disabled={isCancelling}
          className={`bg-red-500 rounded-2xl py-4 items-center justify-center shadow-lg mb-3 ${
            isCancelling ? "opacity-50" : ""
          }`}
          activeOpacity={0.8}
        >
          {isCancelling ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-bold">Cancel Reservation</Text>
          )}
        </TouchableOpacity>
      )}

      {/* View Listing Button */}
      {listingId && (
        <TouchableOpacity
          onPress={() => router.push(`/(consumers)/listing/${listingId}`)}
          className="bg-[#16a34a] rounded-2xl py-4 items-center justify-center shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">View Original Listing</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
