import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import {
  EmptyOrdersState,
  ErrorOrdersState,
  LoadingOrdersState,
  mapReservationToOrder,
  OrderCard,
} from "@/components/screens/restaurants/restaurant-orders-screen";
import {
  useGetRestaurantReservations,
  useUpdateReservationStatus,
  useVerifyReservationPickupByCode,
} from "@/features/reservations/hooks/use-restaurant-reservations";
import { Reservation, ReservationStatus } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LazyQRScannerModal = lazy(() => import("@/components/QRScannerModal"));

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
      setIsScannerVisible(false);

      if (isVerifying) {
        return;
      }

      const matchingReservation = reservations.find((reservation: Reservation) => reservation.pickup?.code === scannedCode);

      if (!matchingReservation) {
        Alert.alert(
          "Order Not Found",
          "No active order found with this pickup code. Please make sure the QR code is correct and the order is ready for pickup.",
          [{ text: "OK" }]
        );
        return;
      }

      verifyPickup(
        {
          reservationId: matchingReservation.id,
          code: scannedCode,
        },
        {
          onSuccess: (resp) => {
            if (resp.success) {
              Alert.alert(
                "Success",
                `Order verified successfully! Order for ${matchingReservation.listing.title} has been marked as picked up.`,
                [{ text: "OK" }]
              );
            }
          },
          onError: (error: any) => {
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
        <LoadingOrdersState />
      </CustomSafeAreaView>
    );
  }

  if (error && orders.length === 0) {
    return (
      <CustomSafeAreaView useSafeArea>
        <ErrorOrdersState onRetry={refetch} />
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
                <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} isUpdating={isUpdatingStatus} />
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
                <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} isUpdating={isUpdatingStatus} />
              ))}
            </View>
          )}

          {orders.length === 0 && <EmptyOrdersState />}
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
