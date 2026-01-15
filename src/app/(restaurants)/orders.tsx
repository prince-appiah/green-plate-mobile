import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { getReservationStatusColor, getReservationStatusLabel } from "@/features/reservations";
import {
  useGetRestaurantReservations,
  useUpdateReservationStatus,
  useVerifyReservationPickupByCode,
} from "@/features/reservations/hooks/use-restaurant-reservations";
import { formatCurrency, formatTimeAgo, Reservation, ReservationStatus } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LazyQRScannerModal = lazy(() => import("@/components/QRScannerModal"));

// Map Reservation to OrderCard format
type OrderCardData = {
  id: string;
  status: ReservationStatus;
  listing: {
    title: string;
    imageUrl: string;
  };
  customer: {
    name: string;
    phone?: string;
  };
  quantity: number;
  totalPrice: number;
  pickupTime: string;
  createdAt: string;
};

const mapReservationToOrder = (reservation: Reservation): OrderCardData => {
  const imageUrl =
    reservation.listing.photoUrls?.[0] || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";

  // Format pickup time from listing pickup times if available
  const pickupTime = reservation.pickup?.verifiedAt
    ? format(reservation.pickup.verifiedAt, "MMM d, yyyy h:mm a")
    : "N/A";

  return {
    id: reservation.id,
    status: reservation.status,
    listing: {
      title: reservation.listing.title,
      imageUrl,
    },
    customer: {
      name: reservation.consumer.name,
      phone: reservation.consumer.phone,
    },
    quantity: reservation.quantity,
    totalPrice: reservation.totalPrice,
    pickupTime,
    createdAt: reservation.createdAt.toString(),
  };
};

export default function RestaurantOrdersScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const { data: reservationsResponse, isPending, error, refetch } = useGetRestaurantReservations();
  const reservations = reservationsResponse?.data || [];
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateReservationStatus();
  const { mutate: verifyPickup, isPending: isVerifying } = useVerifyReservationPickupByCode();

  // Map reservations to order format
  const orders = useMemo(() => reservations.map(mapReservationToOrder), [reservations]);

  const updateOrderStatus = (orderId: string, newStatus: ReservationStatus) => {
    updateStatus(
      {
        reservationId: orderId,
        status: newStatus,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Order status updated successfully");
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.message || error?.message || "Failed to update order status. Please try again."
          );
        },
      }
    );
  };

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "ready_for_pickup"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "cancelled" || o.status === "expired" || o.status === "picked_up"
  );

  const handleQRCodeScanned = useCallback(
    (scannedCode: string) => {
      // Close scanner immediately to prevent any duplicate scans
      setIsScannerVisible(false);

      // Prevent if already verifying
      if (isVerifying) {
        return;
      }

      // Find the reservation that matches the scanned pickup code
      const matchingReservation = reservations.find((reservation) => reservation.pickup?.code === scannedCode);

      console.log("scannedCode", scannedCode);

      if (!matchingReservation) {
        Alert.alert(
          "Order Not Found",
          "No active order found with this pickup code. Please make sure the QR code is correct and the order is ready for pickup.",
          [{ text: "OK" }]
        );
        return;
      }

      // Verify the pickup using the API
      verifyPickup(
        {
          reservationId: matchingReservation.id,
          code: scannedCode,
        },
        {
          onSuccess: (resp) => {
            console.log("Verify pickup response:", JSON.stringify(resp, null, 2));
            if (resp.success) {
              Alert.alert(
                "Success",
                `Order verified successfully! Order for ${matchingReservation.listing.title} has been marked as picked up.`,
                [{ text: "OK" }]
              );
            }
          },
          onError: (error: any) => {
            console.log("Error verifying pickup:", JSON.stringify(error, null, 2));
            Alert.alert(
              "Verification Failed",
              error?.response?.data?.message || error?.message || "Failed to verify pickup. Please try again.",
              [{ text: "OK" }]
            );
          },
        }
      );
    },
    [reservations, verifyPickup, isVerifying]
  );

  if (isPending && orders.length === 0) {
    return (
      <CustomSafeAreaView useSafeArea>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-sm text-[#657c69] mt-4">Loading orders...</Text>
        </View>
      </CustomSafeAreaView>
    );
  }

  if (error && orders.length === 0) {
    return (
      <CustomSafeAreaView useSafeArea>
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-14 h-14 items-center justify-center rounded-full bg-red-100 mb-3">
            <Ionicons name="alert-circle-outline" size={28} color="#ef4444" />
          </View>
          <Text className="font-semibold text-[#1a2e1f] mb-1 text-center">Failed to load orders</Text>
          <Text className="text-sm text-[#657c69] text-center mb-4">Please try again later</Text>
          <TouchableOpacity onPress={() => refetch()} className="bg-[#16a34a] rounded-xl px-6 py-3">
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView useSafeArea>
      <View className=" ">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-[#1a2e1f]">Orders</Text>
            <TouchableOpacity
              onPress={() => setIsScannerVisible(true)}
              className="bg-[#16a34a] rounded-xl px-4 py-2 flex-row items-center disabled:opacity-50"
              disabled={isVerifying || reservations.length === 0}
            >
              <Ionicons name="qr-code-outline" size={20} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Scan QR</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-[#657c69]">Manage incoming orders from customers</Text>
        </View>

        <ScrollView
          className="mb-4"
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}
        >
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-bold text-lg text-[#1a2e1f]">Active Orders</Text>
                <View className="bg-[#16a34a] rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-bold">{activeOrders.length}</Text>
                </View>
              </View>

              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  formatTimeAgo={formatTimeAgo}
                  isUpdating={isUpdatingStatus}
                />
              ))}
            </View>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-bold text-lg text-[#1a2e1f]">Completed Orders</Text>
                <Text className="text-sm text-[#657c69]">{completedOrders.length}</Text>
              </View>

              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  formatTimeAgo={formatTimeAgo}
                  isUpdating={isUpdatingStatus}
                />
              ))}
            </View>
          )}

          {orders.length === 0 && (
            <View className="flex-col items-center justify-center py-12">
              <View className="w-16 h-16 items-center justify-center rounded-full bg-[#16a34a]/10 mb-4">
                <Ionicons name="bag-outline" size={32} color="#16a34a" />
              </View>
              <Text className="font-semibold text-[#1a2e1f] mb-1 text-lg">No orders yet</Text>
              <Text className="text-sm text-[#657c69] text-center">
                Orders will appear here when customers purchase your listings
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* QR Scanner Modal */}
      <Suspense fallback={null}>
        <LazyQRScannerModal
          visible={isScannerVisible}
          onClose={() => setIsScannerVisible(false)}
          onScanSuccess={handleQRCodeScanned}
        />
      </Suspense>
    </CustomSafeAreaView>
  );
}

interface OrderCardProps {
  order: OrderCardData;
  onUpdateStatus: (orderId: string, newStatus: ReservationStatus) => void;
  formatTimeAgo: (dateString: string) => string;
  isUpdating?: boolean;
}

function OrderCard({ order, onUpdateStatus, formatTimeAgo, isUpdating = false }: OrderCardProps) {
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
              className={`flex-1 bg-[#3b82f6] rounded-xl py-2.5 flex-row items-center justify-center mr-2 ${isUpdating ? "opacity-50" : ""
                }`}
            >
              <Ionicons name="checkmark" size={16} color="#ffffff" />
              <Text className="text-white font-semibold text-sm ml-1">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onUpdateStatus(order.id, "cancelled")}
              disabled={isUpdating}
              className={`flex-1 bg-[#fee2e2] rounded-xl py-2.5 flex-row items-center justify-center ${isUpdating ? "opacity-50" : ""
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
            className={`flex-1 bg-[#16a34a] rounded-xl py-2.5 flex-row items-center justify-center ${isUpdating ? "opacity-50" : ""
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
            className={`flex-1 bg-[#16a34a] rounded-xl py-2.5 flex-row items-center justify-center ${isUpdating ? "opacity-50" : ""
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
            className={`flex-1 bg-[#16a34a] rounded-xl py-2.5 flex-row items-center justify-center ${isUpdating ? "opacity-50" : ""
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
