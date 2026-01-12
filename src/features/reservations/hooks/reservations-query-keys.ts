import { GetReservationsQuery, GetRestaurantReservationsQuery } from "../services/reservations-types";

export const reservationsQueryKeys = {
  all: ["reservations"] as const,
  getCustomerReservations: (filters?: GetReservationsQuery) => [...reservationsQueryKeys.all, "getCustomerReservations", filters] as const,
  getCustomerReservationById: (id: string) => [...reservationsQueryKeys.all, "getCustomerReservationById", id] as const,

  getRestaurantReservations: (filters?: GetRestaurantReservationsQuery) =>
    [...reservationsQueryKeys.restaurantLists(), filters] as const,
  restaurantLists: () => [...reservationsQueryKeys.all, "restaurantList"] as const,
  restaurantList: (filters?: GetRestaurantReservationsQuery) =>
    [...reservationsQueryKeys.restaurantLists(), filters] as const,
  restaurantListById: (id: string) => [...reservationsQueryKeys.restaurantLists(), "detail", id] as const,
  reservationById: (id: string) => [...reservationsQueryKeys.all, "detail", id] as const,
};
