import { UserRole, User, Consumer, Restaurant } from '../types/user.types';

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: UserRole): boolean {
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(
  user: User | null | undefined,
  roles: UserRole[]
): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user has all of the specified roles (useful for multi-role scenarios)
 */
export function hasAllRoles(
  user: User | null | undefined,
  roles: UserRole[]
): boolean {
  if (!user) return false;
  return roles.every(role => user.role === role);
}

/**
 * Type-safe role checkers
 */
export function isConsumer(user: User | null | undefined): user is Consumer {
  return user?.role === 'consumer';
}

export function isRestaurant(user: User | null | undefined): user is Restaurant {
  return user?.role === 'restaurant';
}

/**
 * Get role-specific route path
 */
export function getRoleRoute(role: UserRole | undefined): string {
  switch (role) {
    case 'consumer':
      return '/(consumers)';
    case 'restaurant':
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

  // Role-specific routes
  const roleRoutes: Record<UserRole, string[]> = {
    consumer: ['/(consumers)'],
    restaurant: ['/(restaurants)'],
  };

  return roleRoutes[userRole]?.some(allowedRoute => 
    route.startsWith(allowedRoute)
  ) ?? false;
}

