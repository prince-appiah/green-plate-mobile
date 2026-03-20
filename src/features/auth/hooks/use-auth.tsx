import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { authQueryKeys } from "./auth-query-keys";

export const useGetUserInfo = () => {
  const { data, isPending, refetch, error } = useQuery({
    queryKey: authQueryKeys.getUserInfo(),
    queryFn: () => authService.getSession(),
    enabled: true,
  });

  return { data, isPending, refetch };
};
