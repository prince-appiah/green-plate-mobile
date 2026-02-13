import { Reservation, ReservationStatus } from "@/features/shared";
import { format } from "date-fns";

export type OrderCardData = {
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

/**
 * Map Reservation to OrderCard format for UI display
 */
export const mapReservationToOrder = (reservation: Reservation): OrderCardData => {
  const imageUrl =
    reservation.listing.photoUrls?.[0] || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Food+Image";

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
