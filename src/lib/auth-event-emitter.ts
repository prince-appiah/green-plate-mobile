type AuthEventType = 'logout' | 'token-refresh-failed' | 'unauthorized';

type AuthEventCallback = (data?: { reason?: string; error?: Error }) => void;

class AuthEventEmitter {
  private listeners: Map<AuthEventType, Set<AuthEventCallback>> = new Map();

  /**
   * Subscribe to an auth event
   * @returns Unsubscribe function
   */
  on(event: AuthEventType, callback: AuthEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Unsubscribe from an auth event
   */
  off(event: AuthEventType, callback: AuthEventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an auth event to all subscribers
   */
  emit(event: AuthEventType, data?: { reason?: string; error?: Error }): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      // Create a copy of callbacks to avoid issues if callbacks modify the set
      const callbacksCopy = Array.from(callbacks);
      callbacksCopy.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in auth event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners(event?: AuthEventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Export singleton instance
export const authEventEmitter = new AuthEventEmitter();

