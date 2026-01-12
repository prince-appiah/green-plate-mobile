import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import {
  hasRole,
  hasAnyRole,
  isConsumer,
  isRestaurant,
  getRoleRoute,
} from '../utils/role-utils';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permission-utils';
import type { Permission } from '../utils/permission-utils';
import { UserRole, User } from '../types/user.types';

/**
 * Hook to check user roles
 * Uses Zustand auth store for user state
 */
export function useRole() {
  const user = useAuthStore((state) => state.user);

  return useMemo(
    () => ({
      user: user as User | null,
      isLoading: false, // Will be updated when React Query is integrated
      role: user?.role as UserRole | undefined,
      hasRole: (role: UserRole) => hasRole(user as User | null, role),
      hasAnyRole: (roles: UserRole[]) => hasAnyRole(user as User | null, roles),
      isConsumer: isConsumer(user as User | null),
      isRestaurant: isRestaurant(user as User | null),
      roleRoute: getRoleRoute(user?.role as UserRole | undefined),
    }),
    [user]
  );
}

/**
 * Hook to check permissions
 * Uses Zustand auth store for user state
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user);

  return useMemo(
    () => ({
      hasPermission: (permission: Permission) => 
        hasPermission(user as User | null, permission),
      hasAnyPermission: (permissions: Permission[]) =>
        hasAnyPermission(user as User | null, permissions),
      hasAllPermissions: (permissions: Permission[]) =>
        hasAllPermissions(user as User | null, permissions),
    }),
    [user]
  );
}

