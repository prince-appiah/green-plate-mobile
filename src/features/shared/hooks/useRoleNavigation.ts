import { useRouter } from "expo-router";
import { IUserRole } from "../types/user.types";
import { useRole } from "./useRole";

/**
 * Hook for role-aware navigation
 */
export function useRoleNavigation() {
  const router = useRouter();
  const { role, roleRoute } = useRole();

  const navigateToRoleHome = () => {
    router.replace(roleRoute);
  };

  const navigateIfAllowed = (route: string, allowedRoles: IUserRole[]) => {
    if (role && allowedRoles.includes(role)) {
      router.push(route);
    } else {
      router.replace(roleRoute);
    }
  };

  return {
    navigateToRoleHome,
    navigateIfAllowed,
    roleRoute,
  };
}
