import { useRouter } from 'expo-router';
import { useRole } from './useRole';
import { getRoleRoute } from '../utils/role-utils';
import { UserRole } from '../types/user.types';

/**
 * Hook for role-aware navigation
 */
export function useRoleNavigation() {
  const router = useRouter();
  const { role, roleRoute } = useRole();

  const navigateToRoleHome = () => {
    router.replace(roleRoute);
  };

  const navigateIfAllowed = (route: string, allowedRoles: UserRole[]) => {
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

