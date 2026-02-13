import { getReservationStatusColor, getReservationStatusLabel } from "@/features/reservations";
import { formatCurrency, formatTimeAgo, ReservationStatus } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { OrderCardData } from "./order-utils";

interface OrderCardProps {
  order: OrderCardData;
  onUpdateStatus: (orderId: string, newStatus: ReservationStatus) => void;
  isUpdating?: boolean;
}

export function OrderCard({ order, onUpdateStatus, isUpdating = false }: OrderCardProps) {
  const [imageError, setImageError] = useState(false);
  const placeholderImage = "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";
  const statusColor = getReservationStatusColor(order.status);
  const statusLabel = getReservationStatusLabel(order.status);

  const getActionButtons = () => {
    // Don't show buttons for completed, cancelled, or expired orders
    if (order.status === "completed" || order.status === "cancelled" || order.status === "expired") {
      return null;
    }

    switch (order.status) {
      case "pending":
        return (
          <>
            <TouchableOpacity
              onPress={() => onUpdateStatus(order.id, "confirmed")}
              disabled={isUpdating}
              className={`flex-1 bg-[#3b82f6] rounded-xl py-2.5 flex-row items-center justify-center mr-2 ${
                isUpdating ? "opacity-50" : ""
              }`}
            >
              <Ionicons name="checkmark" size={16} color="#ffffff" />
              <Text className="text-white font-semibold text-sm ml-1">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onUpdateStatus(order.id, "cancelled")}
              disabled={isUpdating}
              className={`flex-1 bg-[#fee2e2] rounded-xl py-2.5 flex-row items-center justify-center ${
                isUpdating ? "opacity-50" : ""
              }`}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
              <Text className="text-[#ef4444] font-semibold text-sm ml-1">Cancel</Text>
            </TouchableOpacity>
          </>
        );
      case "confirmed":
        return (
          <TouchableOpacity
            onPress={() => onUpdateStatus(order.id, "ready_for_pickup")}
            disabled={isUpdating}
            className={`flex-1 bg-[#16a34a] rounded-xl py-2.5 flex-row items-center justify-center ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
            <Text className="text-white font-semibold text-sm ml-1">Mark Ready for Pickup</Text>
          </TouchableOpacity>
        );
      case "ready_for_pickup":
        return (
          <TouchableOpacity
            onPress={() => onUpdateStatus(order.id, "picked_up")}
            disabled={isUpdating}
            className={`flex-1 bg-[#16a34a] rounded-xl py-2.5 flex-row items-center justify-center ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <Ionicons name="checkmark-done" size={16} color="#ffffff" />
            <Text className="text-white font-semibold text-sm ml-1">Mark Picked Up</Text>
          </TouchableOpacity>
        );
      case "picked_up":
        return (
          <TouchableOpacity
            onPress={() => onUpdateStatus(order.id, "completed")}
            disabled={isUpdating}
            className={`flex-1 bg-[#16a34a] rounded-xl py-2.5 flex-row items-center justify-center ${
              isUpdating ? "opacity-50" : ""
            }`}
          >
            <Ionicons name="checkmark-done" size={16} color="#ffffff" />
            <Text className="text-white font-semibold text-sm ml-1">Complete</Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View className="bg-white border-2 border-[rgba(22,163,74,0.2)] rounded-3xl shadow-lg mb-4 overflow-hidden">
      {/* Header with Status */}
      <View className="px-4 py-3 flex-row items-center justify-between" style={{ backgroundColor: `${statusColor}10` }}>
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: statusColor }} />
          <Text className="font-bold text-sm" style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>
        <Text className="text-xs text-[#657c69]">{formatTimeAgo(order.createdAt)}</Text>
      </View>

      <View className="p-4">
        {/* Order Info */}
        <View className="flex-row mb-4">
          <Image
            source={{
              uri: imageError ? placeholderImage : order.listing.imageUrl,
            }}
            className="w-20 h-20 rounded-2xl"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <View className="flex-1 ml-3">
            <Text className="text-base font-bold text-[#1a2e1f] mb-1">{order.listing.title}</Text>
            <Text className="text-sm text-[#657c69] mb-2">Quantity: {order.quantity}</Text>
            <Text className="text-lg font-bold text-[#16a34a]">{formatCurrency(order.totalPrice)}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View className="bg-[#eff2f0] rounded-xl p-3 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="person" size={16} color="#657c69" />
            <Text className="text-sm font-semibold text-[#1a2e1f] ml-2">{order.customer.name}</Text>
          </View>
          {order.customer.phone && (
            <View className="flex-row items-center">
              <Ionicons name="call" size={16} color="#657c69" />
              <Text className="text-sm text-[#657c69] ml-2">{order.customer.phone}</Text>
            </View>
          )}
          <View className="flex-row items-center mt-2">
            <Ionicons name="time-outline" size={16} color="#657c69" />
            <Text className="text-sm text-[#657c69] ml-2">Pickup: {order.pickupTime}</Text>
          </View>
        </View>

        {/* Actions */}
        {getActionButtons() && <View className="flex-row">{getActionButtons()}</View>}
      </View>
    </View>
  );
}
