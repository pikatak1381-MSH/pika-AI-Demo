"use client"

import { useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useAuthStore, AuthUser } from "@/stores/useAuthStore"
import { 
    authService, 
    AuthError, 
    LoginRequest, 
    SignUpRequest,
    AuthResponse 
} from "@/lib/api/auth.service"

interface UseAuthOptions {
    requireAuth?: boolean
    redirectIfAuthenticated?: string
    redirectAfterLogin?: string
    redirectAfterSignup?: string
}

type AuthMutationContext = {
    onSuccess?: () => void
    onError?: (error: AuthError) => void
}

export const useAuth = (options: UseAuthOptions = {}) => {
    const {
        requireAuth = false,
        redirectIfAuthenticated,
        redirectAfterLogin = "/chat",
        redirectAfterSignup = "/chat",
    } = options

    const router = useRouter()
    const { user, token, isHydrated, isAuthenticated, setAuth, clearAuth } = useAuthStore()
    
    // Preventing multiple redirects
    const hasRedirected = useRef(false)

    /* ---------------- Route Protection ---------------- */
    useEffect(() => {
        if (!isHydrated || hasRedirected.current) return

        const authenticated = isAuthenticated()

        if (requireAuth && !authenticated) {
            hasRedirected.current = true
            router.replace("/login")
        } else if (redirectIfAuthenticated && authenticated) {
            hasRedirected.current = true
            router.replace(redirectIfAuthenticated)
        }
    }, [isHydrated, isAuthenticated, requireAuth, redirectIfAuthenticated, router])

    /* ---------------- Cross-tab Syncing ---------------- */
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            // Only responding to auth-storage changes
            if (e.key === "auth-storage" || e.key === null) {
                // Triggering re-render by reading from store
                useAuthStore.getState()
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    /* ---------------- Transforming API Response ---------------- */
    const transformAuthResponse = useCallback((data: AuthResponse) => {
        const user: AuthUser = {
            userId: data.user_id,
            email: data.email,
            preferredName: data.preferred_name,
        }

        setAuth({
            user,
            token: data.session_token,
            expiresAt: data.expires_at,
        })

        return { user, token: data.session_token }
    }, [setAuth])

  /* ---------------- Login Mutation ---------------- */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data, _, context) => {
        transformAuthResponse(data)
      
        // Calling custom onSuccess if provided
        if ((context as AuthMutationContext)?.onSuccess) {
            ;(context as AuthMutationContext).onSuccess!()
        } else {
            // Default behavior
            router.push(redirectAfterLogin)
        }
    },
    onError: (error: AuthError, _, context) => {
        // Calling custom onError if provided
        ;(context as AuthMutationContext)?.onError?.(error)
    },
  })

    /* ---------------- SignUp Mutation ---------------- */
    const signUpMutation = useMutation({
        mutationFn: (data: SignUpRequest) => authService.signUp(data),
        onSuccess: (data, _, context) => {
            transformAuthResponse(data)
            
            // Calling custom onSuccess if provided
            if ((context as AuthMutationContext)?.onSuccess) {
                ;(context as AuthMutationContext).onSuccess!()
            } else {
                // Default behavior
                router.push(redirectAfterSignup)
            }
        },
        onError: (error: AuthError, _, context) => {
            // Calling custom onError if provided
            ;(context as AuthMutationContext)?.onError?.(error)
        },
    })

    /* ---------------- Logout Mutation ---------------- */
    const logoutMutation = useMutation({
        mutationFn: async () => {
            if (token) {
                await authService.logout(token)
            }
        },
        onSettled: () => {
            clearAuth()
            // Clearing persisted storage
            useAuthStore.persist.clearStorage?.()
            hasRedirected.current = false
            router.replace("/login")
        },
    })

    /* ---------------- Refreshing Token ---------------- */
    const refreshMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new AuthError("No token to refresh")
            return authService.refreshToken(token)
        },
            onSuccess: (data) => {
            transformAuthResponse(data)
        },
        onError: () => {
            // If refresh fails, logout
            clearAuth()
            router.replace("/login")
        },
    })

    /* ---------------- Auto Refreshing Before Expiry ---------------- */
    useEffect(() => {
        if (!isAuthenticated() || !useAuthStore.getState().expiresAt) return

        const expiresAt = new Date(useAuthStore.getState().expiresAt!).getTime()
        const now = Date.now()
        const timeUntilExpiry = expiresAt - now
        
        // Refreshing 5 minutes before expiry
        const refreshTime = timeUntilExpiry - 5 * 60 * 1000

        if (refreshTime <= 0) {
        // Already expired or about to expire
        refreshMutation.mutate()
        return
        }

        const timeoutId = setTimeout(() => {
        refreshMutation.mutate()
        }, refreshTime)

        return () => clearTimeout(timeoutId)
    }, [token, isAuthenticated, refreshMutation])

    return {
        // State
        user,
        token,
        isAuthenticated: isAuthenticated(),
        isHydrated,
        isLoading: !isHydrated,

        // Login
        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,
        loginStatus: {
        isPending: loginMutation.isPending,
        isError: loginMutation.isError,
        isSuccess: loginMutation.isSuccess,
        error: loginMutation.error,
        },

        // SignUp
        signUp: signUpMutation.mutate,
        signUpAsync: signUpMutation.mutateAsync,
        signUpStatus: {
        isPending: signUpMutation.isPending,
        isError: signUpMutation.isError,
        isSuccess: signUpMutation.isSuccess,
        error: signUpMutation.error,
        },

        // Logout
        logout: logoutMutation.mutate,
        logoutAsync: logoutMutation.mutateAsync,
        logoutStatus: {
        isPending: logoutMutation.isPending,
        isError: logoutMutation.isError,
        error: logoutMutation.error,
        },

        // Refresh
        refreshToken: refreshMutation.mutate,
        refreshStatus: {
        isPending: refreshMutation.isPending,
        isError: refreshMutation.isError,
        },
    }
}