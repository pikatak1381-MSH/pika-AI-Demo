// stores/useAuthStore.ts
import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"

type AuthState = {
  userId: string | null
  token: string | undefined
  email: string | null
  preferredName: string | null
  expiresAt: string | null
  setAuth: (data: Partial<AuthState>) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
        userId: null,
        token: undefined,
        email: null,
        preferredName: null,
        expiresAt: null,

        setAuth: (data) => set(data),

        clearAuth: () =>
            set({
                userId: null,
                token: undefined,
                email: null,
                preferredName: null,
                expiresAt: null,
            }),

        isAuthenticated: () => {
            const { token, expiresAt } = get()
            if (!token) return false
            if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
                return false
            }
            return true
            },
        }),
    {
        name: "auth-storage",
        storage: createJSONStorage(() =>
            typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
)