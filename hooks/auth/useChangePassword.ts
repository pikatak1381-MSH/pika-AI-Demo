 "use client"

import { useMutation } from "@tanstack/react-query"
import { authService, AuthError, ChangePasswordRequest, ChangePasswordResponse } from "@/lib/api/auth.service"
import { useAuthToken, useAuthUser } from "@/stores/useAuthStore"

interface UseChangePasswordOptions {
  onSuccess?: (data: ChangePasswordResponse) => void
  onError?: (error: AuthError) => void
  onSettled?: () => void
}

export const useChangePassword = (options?: UseChangePasswordOptions) => {
  const user = useAuthUser()
  const token = useAuthToken()

  const mutation = useMutation<
    ChangePasswordResponse,
    AuthError,
    Omit<ChangePasswordRequest, "userId">
  >({
    mutationFn: async (data) => {
      if (!user?.userId) {
        throw new AuthError("کاربر یافت نشد", 401, "USER_NOT_FOUND")
      }

      if (!token) {
        throw new AuthError("توکن احراز هویت یافت نشد", 401, "TOKEN_NOT_FOUND")
      }

      return authService.changePassword(
        {
          userId: user.userId,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        token
      )
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
    onSettled: () => {
      options?.onSettled?.()
    },
  })

  return {
    changePassword: mutation.mutate,
    changePasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}