import { useAuthEvents } from "@/features/auth/hooks/use-auth-events";
import { authQueryKeys } from "@/features/auth/hooks/auth-query-keys";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

/**
 * Listens to auth events (e.g. 401) and redirects to login after clearing session.
 */
export function AuthEventListener() {
  const { signOut } = useAuthStore();
  const queryClient = useQueryClient();

  useAuthEvents({
    autoRedirect: true,
    onUnauthorized: async () => {
      await GoogleSignin.signOut();
      await signOut();
      queryClient.removeQueries({ queryKey: authQueryKeys.getUserInfo() });
      queryClient.clear();
      router.replace("/(auth)/login");
    },
  });

  return null;
}

