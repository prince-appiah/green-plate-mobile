import { UserRole, User, Consumer, Restaurant } from '../types/user.types';

/** Get role only when user has a role (Consumer/BaseUser); Restaurant has no role */
function getRole(user: User | null | undefined): UserRole | undefined {
  if (!user || !('role' in user)) return undefined;
  return (user as { role: UserRole }).role;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: UserRole): boolean {
  return getRole(user) === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(
  user: User | null | undefined,
  roles: UserRole[]
): boolean {
  const r = getRole(user);
  return r !== undefined && roles.includes(r);
}

/**
 * Check if user has all of the specified roles (useful for multi-role scenarios)
 */
export function hasAllRoles(
  user: User | null | undefined,
  roles: UserRole[]
): boolean {
  const r = getRole(user);
  return r !== undefined && roles.every(role => r === role);
}

/**
 * Type-safe role checkers
 */
export function isConsumer(user: User | null | undefined): user is Consumer {
  return getRole(user) === 'consumer';
}

export function isRestaurant(user: User | null | undefined): user is Restaurant {
  return getRole(user) === 'restaurantOwner';
}

/**
 * Get role-specific route path
 */
export function getRoleRoute(role: UserRole | undefined): string {
  switch (role) {
    case 'consumer':
      return '/(consumers)';
    case 'restaurantOwner':
      return '/(restaurants)';
    default:
      return '/(auth)/login';
  }
}

/**
 * Check if route is accessible by role
 */
export function canAccessRoute(
  route: string,
  userRole: UserRole | undefined
): boolean {
  if (!userRole) return false;

  // Public routes
  const publicRoutes = ['/(auth)', '/(onboarding)'];
  if (publicRoutes.some(publicRoute => route.startsWith(publicRoute))) {
    return true;
  }

  // Role-specific routes (IUserRole: consumer | restaurantOwner | admin)
  const roleRoutes: Record<UserRole, string[]> = {
    consumer: ['/(consumers)'],
    restaurantOwner: ['/(restaurants)'],
    admin: ['/(auth)/login'],
  };

  return roleRoutes[userRole]?.some(allowedRoute =>
    route.startsWith(allowedRoute)
  ) ?? false;
}

