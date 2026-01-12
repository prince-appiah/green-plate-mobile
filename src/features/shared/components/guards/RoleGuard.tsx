import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useRole } from "../../hooks/useRole";
import { getRoleRoute } from "../../utils/role-utils";
import { IUserRole } from "../../types/user.types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: IUserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, redirectTo, fallback }: RoleGuardProps) {
  const { user, isLoading, hasAnyRole } = useRole();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (!hasAnyRole(allowedRoles)) {
      const targetRoute = redirectTo || getRoleRoute(user.role);
      router.replace(targetRoute);
    }
  }, [user, isLoading, allowedRoles, hasAnyRole, redirectTo]);

  if (isLoading) {
    return (
      fallback || (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      )
    );
  }

  if (!user || !hasAnyRole(allowedRoles)) {
    return fallback || null;
  }

  return <>{children}</>;
}
