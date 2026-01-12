import { ReactNode } from "react";
import { useRole } from "../../hooks/useRole";
import { IUserRole } from "../../types/user.types";

interface WithRoleProps {
  children: ReactNode;
  allowedRoles: IUserRole[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

/**
 * HOC to conditionally render content based on role
 */
export function WithRole({ children, allowedRoles, fallback = null, showFallback = false }: WithRoleProps) {
  const { hasAnyRole } = useRole();

  if (hasAnyRole(allowedRoles)) {
    return <>{children}</>;
  }

  return showFallback ? <>{fallback}</> : null;
}
