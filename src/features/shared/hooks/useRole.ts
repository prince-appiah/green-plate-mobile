import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";
import { BaseUser, IUserRole } from "../types/user.types";
import type { Permission } from "../utils/permission-utils";
import { hasAllPermissions, hasAnyPermission, hasPermission } from "../utils/permission-utils";
import { getRoleRoute, hasAnyRole, hasRole, isConsumer, isRestaurant } from "../utils/role-utils";

/**
 * Hook to check user roles
 * Uses Zustand auth store for user state
 */
export function useRole() {
  const user = useAuthStore((state) => state.user);

  return useMemo(
    () => ({
      user: user as BaseUser | null,
      isLoading: false, // Will be updated when React Query is integrated
      role: user?.role as IUserRole | undefined,
      hasRole: (role: IUserRole) => hasRole(user as BaseUser | null, role),
      hasAnyRole: (roles: IUserRole[]) => hasAnyRole(user as BaseUser | null, roles),
      isConsumer: isConsumer(user as BaseUser | null),
      isRestaurant: isRestaurant(user as BaseUser | null),
      roleRoute: getRoleRoute(user?.role as IUserRole | undefined),
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
      hasPermission: (permission: Permission) => hasPermission(user as BaseUser | null, permission),
      hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user as BaseUser | null, permissions),
      hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user as BaseUser | null, permissions),
    }),
    [user]
  );
}
