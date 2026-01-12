import { ReactNode } from 'react';
import { usePermission } from '../../hooks/useRole';
import { Permission } from '../../utils/permission-utils';

interface WithPermissionProps {
  children: ReactNode;
  permission: Permission | Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * HOC to conditionally render content based on permission
 */
export function WithPermission({
  children,
  permission,
  requireAll = false,
  fallback = null,
}: WithPermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

