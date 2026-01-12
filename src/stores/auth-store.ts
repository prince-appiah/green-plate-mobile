import { User } from "@/features/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: async (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: async () => {
        set({ user: null, isLoading: false });
        await AsyncStorage.removeItem("@clean_plate:auth");
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: "@clean_plate:auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user, not loading state
    }
  )
);
