import type { GetPublicListingByIdResponse } from "@/features/listings/services/listings-types";
import React from "react";
import { Text, View } from "react-native";

interface ListingDetailsCardProps {
  listing: GetPublicListingByIdResponse;
}

export function ListingDetailsCard({ listing }: ListingDetailsCardProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-[#1a2e1f] mb-3">Listing Details</Text>
      <View className="bg-white border border-[#e5e7eb] rounded-2xl p-4">
        {listing.description && <Text className="text-base text-[#657c69] mb-3">{listing.description}</Text>}
        <View className="flex-row items-center">
          <View className="bg-[rgba(220,252,231,0.4)] rounded-xl px-3 py-1">
            <Text className="text-[#14532d] text-sm font-medium capitalize">{listing.category}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
