import { useEffect } from 'react';
import { authEventEmitter } from '@/lib/auth-event-emitter';
import { router, useSegments } from 'expo-router';

type AuthEventOptions = {
  onLogout?: () => void;
  onTokenRefreshFailed?: () => void;
  onUnauthorized?: () => void;
  autoRedirect?: boolean; // Default: true
  redirectTo?: string; // Default: '/(auth)/login'
};

/**
 * Hook to listen to auth events
 *
 * @example
 * useAuthEvents({
 *   onLogout: () => {
 *     // Custom logout logic
 *     router.replace('/(auth)/login');
 *   },
 *   autoRedirect: false // Disable auto redirect if you want custom handling
 * });
 */
export function useAuthEvents(options: AuthEventOptions = {}) {
  const {
    onLogout,
    onTokenRefreshFailed,
    onUnauthorized,
    autoRedirect = true,
    redirectTo = '/(auth)/login',
  } = options;

  const segments = useSegments();

  useEffect(() => {
    const isAuthRoute = () => {
      const currentRoute = segments[segments.length - 1];
      // Check if we are on login, welcome, or any other public auth screen
      // Add other auth route names if necessary
      return currentRoute === 'login' || currentRoute === 'welcome' || segments[0] === '(auth)';
    };

    const handleLogout = () => {
      if (onLogout) {
        onLogout();
      } else if (autoRedirect && !isAuthRoute()) {
        router.replace(redirectTo);
      }
    };

    const handleTokenRefreshFailed = () => {
      if (onTokenRefreshFailed) {
        onTokenRefreshFailed();
      } else if (autoRedirect && !isAuthRoute()) {
        router.replace(redirectTo);
      }
    };

    const handleUnauthorized = () => {
      if (onUnauthorized) {
        onUnauthorized();
      } else if (autoRedirect && !isAuthRoute()) {
        router.replace(redirectTo);
      }
    };

    // Subscribe to events
    const unsubscribeLogout = authEventEmitter.on('logout', handleLogout);
    const unsubscribeRefreshFailed = authEventEmitter.on(
      'token-refresh-failed',
      handleTokenRefreshFailed
    );
    const unsubscribeUnauthorized = authEventEmitter.on(
      'unauthorized',
      handleUnauthorized
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeLogout();
      unsubscribeRefreshFailed();
      unsubscribeUnauthorized();
    };
  }, [
    onLogout,
    onTokenRefreshFailed,
    onUnauthorized,
    autoRedirect,
    redirectTo,
    segments,
  ]);
}

