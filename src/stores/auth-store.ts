import { BaseUser } from "@/features/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: BaseUser | null;
  isLoading: boolean;
  setUser: (user: BaseUser | null) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
  // clearUser: () => void;
}

const AUTH_STORE_KEY = "@clean_plate:authStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: async (user) => {
        await set({ user });
      },
      setLoading: (isLoading) => set({ isLoading }),
      signOut: async () => {
        set({ user: null, isLoading: false });
        await AsyncStorage.removeItem(AUTH_STORE_KEY);
      },
      // clearUser: () => set({ user: null }),
    }),
    {
      name: AUTH_STORE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user, not loading state
    }
  )
);
