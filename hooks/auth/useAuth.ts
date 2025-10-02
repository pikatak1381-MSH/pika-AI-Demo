"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/useAuthStore"

interface UseAuthOptions {
    requireAuth?: boolean // for protected pages
    redirectIfAuthenticated?: string // for login/signup pages
}

async function loginRequest(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Login failed")

  return data
}

async function logoutRequest(token: string | undefined) {
  if (!token) return
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || "Logout failed")
  }
}

export const useAuth = ({ 
    requireAuth = false, redirectIfAuthenticated 
}: UseAuthOptions = {}) => {
    const [isReady, setIsReady] = useState(false)
    const { userId, token, isAuthenticated, setAuth, clearAuth} = useAuthStore()
    const router = useRouter()


  /* ---------------- Hydration ---------------- */
    useEffect(() => {
    // If already hydrated, mark ready
        if (useAuthStore.persist.hasHydrated()) {
            setIsReady(true)
        } else {
            // Otherwise, wait for hydration
            const unsubscribe = useAuthStore.persist.onFinishHydration(() => setIsReady(true))
            return unsubscribe
        }
    }, [])

  /* ---------------- Cross-tab sync ---------------- */
    useEffect(() => {
        const handler = () => setIsReady((prev) => !prev)
        window.addEventListener("storage", handler)
        return () => window.removeEventListener("storage", handler)
    }, [])

  /* ---------------- Route protection / redirects ---------------- */
    useEffect(() => {
        if (!isReady) return
        if (requireAuth && !isAuthenticated()) {
            router.replace("/login")
        }
        if (redirectIfAuthenticated && isAuthenticated()) {
            router.replace(redirectIfAuthenticated)
        }
    }, [isReady, isAuthenticated, requireAuth, redirectIfAuthenticated, router])

    /* ---------------- Mutations ---------------- */
    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
        loginRequest(email, password),
        onSuccess: (data) => {
        setAuth({
            userId: data.user_id,
            token: data.session_token,
            email: data.email,
            preferredName: data.preferred_name,
            expiresAt: data.expires_at,
        })
        if (redirectIfAuthenticated) {
            router.replace(redirectIfAuthenticated)
        }
        },
    })

    const logoutMutation = useMutation({
        mutationFn: () => logoutRequest(token),
        onSettled: () => {
        clearAuth()
        useAuthStore.persist.clearStorage?.()
        router.replace("/login")
        },
    })

    return {
        userId,
        token,
        isAuthenticated,
        isReady,
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        loginStatus: {
            isPending: loginMutation.isPending,
            isError: loginMutation.isError,
            error: loginMutation.error,
        },
        logout: logoutMutation.mutate,
        logoutAsync: logoutMutation.mutateAsync,
        logoutStatus: {
            isPending: logoutMutation.isPending,
            isError: logoutMutation.isError,
            error: logoutMutation.error,
        },
    }
}