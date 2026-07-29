import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isSessionLoading: boolean;
  setUser: (user: User | null) => void;
  setSessionLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isSessionLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
        }),

      setSessionLoading: (isSessionLoading) => set({ isSessionLoading }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isSessionLoading: false,
        }),
    }),
    {
      name: 'ghazala-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
