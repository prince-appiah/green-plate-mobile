export const restaurantsQueryKeys = {
  all: ["restaurants"] as const,
  profile: (userId: string) =>
    [...restaurantsQueryKeys.all, "profile", userId] as const,
  stats: (userId: string) =>
    [...restaurantsQueryKeys.all, "stats", userId] as const,
  settings: () => [...restaurantsQueryKeys.all, "settings"] as const,
  details: () => [...restaurantsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantsQueryKeys.details(), id] as const,
};
