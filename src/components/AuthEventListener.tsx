import { useAuthEvents } from '@/features/auth/hooks/use-auth-events';

/**
 * Component that listens to auth events globally and handles redirects
 * This should be placed in the root layout to handle auth state changes app-wide
 */
export function AuthEventListener() {
  // Global auth event handler - redirects to login on auth failures
  useAuthEvents();

  return null; // This component doesn't render anything
}

