import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { accountsService } from "../services/accounts.service";
import { accountsQueryKeys } from "./accounts-query-keys";
import { useAuthStore } from "@/stores/auth-store";

const getProfileQueryOptions = (userId: string) => ({
  queryKey: accountsQueryKeys.profileByUserId(userId),
  queryFn: () => accountsService.getProfile(),
});

export const useGetProfile = () => {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({ ...getProfileQueryOptions(userId!) });
};

export const useGetProfileSuspense = () => {
  const userId = useAuthStore((state) => state.user?.id);
  return useSuspenseQuery(getProfileQueryOptions(userId!));
};
