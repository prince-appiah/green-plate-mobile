import { ReservationStatus } from "../shared";

export const getReservationStatusConfig = (status: ReservationStatus) => {
  switch (status) {
    case "ready_for_pickup":
      return {
        label: "Ready for Pickup",
        icon: "checkmark-done-circle" as const,
        color: "#16a34a",
        bgColor: "#dcfce7",
      };
    case "picked_up":
      return {
        label: "Picked Up",
        icon: "checkmark-circle-outline" as const,
        color: "#16a34a",
        bgColor: "#dcfce7",
      };
    case "pending":
      return {
        label: "Pending",
        icon: "hourglass-outline" as const,
        color: "#f59e0b",
        bgColor: "#fef3c7",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        icon: "checkmark-circle-outline" as const,
        color: "#16a34a",
        bgColor: "#dcfce7",
      };
    case "completed":
      return {
        label: "Completed",
        icon: "checkmark-done-circle" as const,
        color: "#16a34a",
        bgColor: "#dcfce7",
      };
    case "expired":
      return {
        label: "Expired",
        icon: "time-outline" as const,
        color: "#657c69",
        bgColor: "#e5e7eb",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: "close-circle-outline" as const,
        color: "#ef4444",
        bgColor: "#fee2e2",
      };
    default:
      return {
        label: "Unknown",
        icon: "alert-circle-outline" as const,
        color: "#9ca3af",
        bgColor: "#e5e7eb",
      };
  }
};

export const getReservationStatusLabel = (status: ReservationStatus) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "ready_for_pickup":
      return "Ready for Pickup";
    case "picked_up":
      return "Picked Up";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "expired":
      return "Expired";
    default:
      return status;
  }
};

export const getReservationStatusColor = (status: ReservationStatus) => {
  switch (status) {
    case "pending":
      return "#f59e0b";
    case "confirmed":
      return "#3b82f6";
    case "ready_for_pickup":
      return "#16a34a";
    case "picked_up":
      return "#16a34a";
    case "completed":
      return "#6b7280";
    case "cancelled":
      return "#ef4444";
    case "expired":
      return "#9ca3af";
    default:
      return "#6b7280";
  }
};
