import type { BaseUser, IUserRole } from "@/features/shared/types/user.types";

/**
 * User shape from GET /auth/me or POST /auth/google (account response).
 * Maps to BaseUser for app state.
 */
export interface SessionUser {
  id: string;
  userId?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  onboardingCompleted?: boolean;
  avatarUrl?: string | null;
  phone?: string | null;
  lastLoginAt?: Date | null;
  isActive?: boolean;
}

export function mapSessionUserToBaseUser(
  user: SessionUser | null,
): BaseUser | null {
  if (!user) return null;
  const accountId = user.userId ?? user.id;

  return {
    id: accountId,
    email: user.email ?? "",
    name: user.name ?? "",
    phone: user.phone ?? "",
    role: (user.role as IUserRole) ?? "consumer",
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : new Date(),
    isActive: user.isActive ?? true,
    onboardingCompleted: user.onboardingCompleted ?? false,
    avatarUrl: user.avatarUrl ?? user.image ?? undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };
}
