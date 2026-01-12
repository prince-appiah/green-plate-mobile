import { User } from '../types/user.types';

export type Permission = 
  | 'view_analytics'
  | 'manage_listings'
  | 'manage_orders'
  | 'view_reports'
  | 'manage_settings'
  | 'create_bookings'
  | 'cancel_bookings';

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  user: User | null | undefined,
  permission: Permission
): boolean {
  if (!user) return false;

  // Role-based default permissions
  const rolePermissions: Record<User['role'], Permission[]> = {
    consumer: ['create_bookings', 'cancel_bookings'],
    restaurant: ['manage_listings', 'manage_orders', 'view_analytics'],
  };

  return rolePermissions[user.role]?.includes(permission) ?? false;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

