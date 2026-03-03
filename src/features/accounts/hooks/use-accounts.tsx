import { useGoogleSignin } from "@/features/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { accountsService } from "../services/accounts.service";
import { accountsQueryKeys } from "./accounts-query-keys";

const getProfileQueryOptions = (userId: string) => ({
  queryKey: accountsQueryKeys.profileByUserId(userId),
  queryFn: () => accountsService.getProfile(),
});

export const useGetProfile = () => {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    ...getProfileQueryOptions(userId || ""),
    enabled: !!userId,
  });
};

export const useGetProfileSuspense = () => {
  const userId = useAuthStore((state) => state.user?.id);
  return useSuspenseQuery(getProfileQueryOptions(userId!));
};

export const useDeactivateAccount = () => {
  const { handleLogout } = useGoogleSignin();
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => accountsService.deactivateAccount(userId!),
    onSuccess: async (resp) => {
      queryClient.invalidateQueries({ queryKey: accountsQueryKeys.profileByUserId(userId!) });
      await handleLogout();
    },
  });

  return mutation;
};

export const useDeleteAccount = () => {
  const { handleLogout } = useGoogleSignin();
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (confirmPermanentDeletion: boolean) => accountsService.deleteAccount(confirmPermanentDeletion),
    onSuccess: async (resp) => {
      queryClient.invalidateQueries({ queryKey: accountsQueryKeys.profileByUserId(userId!) });
      await handleLogout();
    },
  });

  return mutation;
};
