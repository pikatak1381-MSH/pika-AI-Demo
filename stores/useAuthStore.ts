import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"

export type AuthUser = {
  userId: string
  email: string
  preferredName: string | null
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  expiresAt: string | null
  isHydrated: boolean
  
  // Actions
  setAuth: (data: { user: AuthUser; token: string; expiresAt: string }) => void
  clearAuth: () => void
  setHydrated: (hydrated: boolean) => void
  
  // Computed
  isAuthenticated: () => boolean
  isTokenExpired: () => boolean
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresAt: null,
      isHydrated: false,

      setAuth: (data) => set({
        user: data.user,
        token: data.token,
        expiresAt: data.expiresAt,
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        expiresAt: null,
      }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      isTokenExpired: () => {
        const { expiresAt } = get()
        if (!expiresAt) return true
        return new Date(expiresAt).getTime() < Date.now()
      },

      isAuthenticated: () => {
        const { token, isTokenExpired } = get()
        return !!token && !isTokenExpired()
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
      onRehydrateStorage: () => (state) => {
        // Auto-clear expired tokens on hydration
        if (state?.isTokenExpired()) {
          state.clearAuth()
        }
        state?.setHydrated(true)
      },
    }
  )
)

// Selector hooks for better performance
export const useAuthToken = () => useAuthStore((state) => state.token)
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated())