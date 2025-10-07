export type LoginRequest = {
  email: string
  password: string
}

export type SignUpRequest = {
  fullName: string
  email: string
  password: string
}

export type ChangePasswordRequest = {
  userId: string
  currentPassword: string
  newPassword: string
}

export type AuthResponse = {
  user_id: string
  session_token: string
  email: string
  preferred_name: string | null
  expires_at: string
}

export type ChangePasswordResponse = {
  message: string
  user: {
    user_id: string
    email: string
    preferred_name: string
    is_active: string
    updated_at: string
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = "AuthError"
  }
}

class AuthService {
  private baseUrl = "/api/auth"

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new AuthError(
          data.message || `Request failed with status ${response.status}`,
          response.status,
          data.code
        )
      }

      return data as T
    } catch (error) {
      if (error instanceof AuthError) throw error
      
      // Network or other errors
      throw new AuthError(
        error instanceof Error ? error.message : "Network error occurred"
      )
    }
  }

  //Auth Methods

  /**
   * Loggin in with email and password
   * @param credentials - User email and password
   * @returns Auth response with session token
  */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  /**
   * Creating new user account
   * @param data - User registration data
   * @returns Auth response with session token
  */
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/signup", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        preferred_name: data.fullName,
        password: data.password,
      }),
    })
  }

  /**
   * Logging out current user
   * @param token - Current session token
  */
  async logout(token: string): Promise<void> {
    // Note: In production, we will use httpOnly cookies instead of sending token
    return this.request<void>("/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Password Management

  /**
   * Change user password
   * @param data - Password change data
   * @param token - Current session token
   * @returns Updated user information
   */
  async changePassword(
    data: ChangePasswordRequest,
    token: string
  ): Promise<ChangePasswordResponse> {
    return this.request<ChangePasswordResponse>("/change-password", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: data.userId,
        current_password: data.currentPassword,
        new_password: data.newPassword,
      }),
    })
  }

  /**
   * Request password reset email
   * @param email - User email address
   */
  async requestPasswordReset(email: string): Promise<void> {
    return this.request<void>("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  /**
   * Reset password with token from email
   * @param token - Reset token from email
   * @param newPassword - New password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.request<void>("/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: newPassword }),
    })
  }

  /* Token Management */
  /**
   * Refresh session token
   * @param token - Current session token
   * @returns New auth response with refreshed token
  */
  async refreshToken(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  /* Email Verification */
  async verifyEmail(code: string): Promise<void> {
    return this.request<void>("/verify-email", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  }
}

export const authService = new AuthService()