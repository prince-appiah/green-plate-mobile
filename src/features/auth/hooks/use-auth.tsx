import { useQuery } from "@tanstack/react-query";
import { authQueryKeys } from "./auth-query-keys";
import { authService } from "../services/auth.service";
import { tokenStorage } from "@/lib/token-storage";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";

export const useGetUserInfo = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await tokenStorage.getToken();
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  const { data, isPending, refetch, error } = useQuery({
    queryKey: authQueryKeys.getUserInfo(),
    queryFn: () => authService.getUserInfo(),
    enabled: hasToken === true, // Only enable when we've checked and token exists
    retry: false, // Don't retry on failure
  });

  // Handle errors when they occur (React Query v5 doesn't support onError)
  useEffect(() => {
    if (error) {
      const handleError = async () => {
        if (error instanceof AxiosError) {
          const status = error?.response?.status;

          // Clear tokens on 401 (unauthorized) - token is definitely invalid
          if (status === 401) {
            console.log("Clearing invalid tokens due to 401 Unauthorized");
            await tokenStorage.clearTokens();
            setHasToken(false);
          }

          // For 500 errors, clear tokens if it seems auth-related
          // (Some backends return 500 for invalid tokens instead of 401)
          if (status === 500) {
            console.log("Received 500 error, clearing tokens as precaution");
            await tokenStorage.clearTokens();
            setHasToken(false);
          }
        }
      };
      handleError();
    }
  }, [error]);

  return { data, isPending, refetch };
};
