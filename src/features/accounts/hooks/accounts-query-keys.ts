export const accountsQueryKeys = {
  all: ["accounts"] as const,
  profileByUserId: (userId: string) =>
    [...accountsQueryKeys.all, "profile", userId] as const,
};
