import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Types & Validation Schemas
const signUpSchema = z.object({
  email: z.string().email("فرمت ایمیل نامعتبر است"),
  preferred_name: z
    .string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .max(100, "نام نباید بیشتر از 100 کاراکتر باشد"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
    .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
    .regex(/\d/, "رمز عبور باید حداقل یک عدد داشته باشد"),
})

type SignUpRequest = z.infer<typeof signUpSchema>

interface BackendUserResponse {
  email: string
  preferred_name: string
  user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface SignUpErrorResponse {
  detail?: string
  message?: string
  error?: string
}

// Error Handling
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const handleBackendError = (
    status: number,
    data: SignUpErrorResponse
): ApiError => {
  const message = data.detail || data.message || data.error || "خطای نامشخص"

  switch (status) {
    case 400:
      if (message.toLowerCase().includes("email")) {
          return new ApiError("این ایمیل قبلاً ثبت شده است", 400, "EMAIL_EXISTS")
      }
    return new ApiError(message, 400, "VALIDATION_ERROR")

    case 409:
      return new ApiError("این حساب کاربری قبلاً وجود دارد", 409, "CONFLICT")

    case 422:
      return new ApiError("اطلاعات ورودی نامعتبر است", 422, "INVALID_INPUT")

    case 429:
      return new ApiError(
          "درخواست‌های زیادی ارسال شده است. لطفاً بعداً تلاش کنید",
          429,
          "RATE_LIMIT"
      )

    case 500:
    case 502:
    case 503:
      return new ApiError(
          "سرور با مشکل مواجه است. لطفاً بعداً تلاش کنید",
          503,
          "SERVER_ERROR"
      )

    default:
        return new ApiError(message, status, "UNKNOWN_ERROR")
    }
}

// Session Token Generation
const generateSessionToken = (userId: string): string => {
  // In production, we will use proper JWT or session token generation
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `sess_${userId}_${timestamp}_${random}`
}

const calculateExpiry = (hours: number = 24): string => {
  const expiryDate = new Date()
  expiryDate.setHours(expiryDate.getHours() + hours)
  return expiryDate.toISOString()
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    let body: SignUpRequest

    try {
        const rawBody = await request.json()
        body = signUpSchema.parse(rawBody)
    } catch (error) {
        if (error instanceof z.ZodError) {
                const firstError = error.errors[0]
                return NextResponse.json(
                {
                    message: firstError.message,
                    code: "VALIDATION_ERROR",
                    field: firstError.path.join("."),
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: "فرمت درخواست نامعتبر است", code: "INVALID_JSON" },
            { status: 400 }
        )
    }

    const baseURL = process.env.BASE_URL
    
    let backendResponse: Response

    try {
        backendResponse = await fetch(`${baseURL}/users/create`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email: body.email.toLowerCase().trim(),
            preferred_name: body.preferred_name.trim(),
            password: body.password,
            }),
        })
    } catch (error) {
        console.error("Network error calling Backend API:", error)
        return NextResponse.json(
            {
                message: "خطا در برقراری ارتباط با سرور",
                code: "NETWORK_ERROR",
            },
            { status: 503 }
        )
    }

    if (!backendResponse.ok) {
        let errorData: SignUpErrorResponse = {}

        try {
            errorData = await backendResponse.json()
        } catch {
            // If response is not JSON, use status text
            errorData = { message: backendResponse.statusText }
        }

        const apiError = handleBackendError(backendResponse.status, errorData)

      // Logging error for monitoring (Will use better monitoring service later)
        console.error("Backend API error:", {
            status: backendResponse.status,
            error: errorData,
            email: body.email,
        })

        return NextResponse.json(
            {
            message: apiError.message,
            code: apiError.code,
            },
            { status: apiError.statusCode }
        )
    }

    let userData: BackendUserResponse

    try {
            userData = await backendResponse.json()
        } catch (error) {
            console.error("Error parsing backend response:", error)
        return NextResponse.json(
            { message: "خطا در پردازش پاسخ سرور", code: "PARSE_ERROR" },
            { status: 500 }
        )
    }

    // Generateing Session Token
    // NOTE: In production, we should:
    // - Store session in database
    // - Use secure JWT with proper signing
    // - Implement refresh tokens
    // - Consider using httpOnly cookies instead of returning token
    const sessionToken = generateSessionToken(userData.user_id)
    const expiresAt = calculateExpiry(24) // 24 hours

    // Transforming to Frontend Format
    const response = {
        user_id: userData.user_id,
        session_token: sessionToken,
        email: userData.email,
        preferred_name: userData.preferred_name,
        expires_at: expiresAt,
        is_active: userData.is_active,
    }

    // Setting httpOnly Cookie (for later)
    const nextResponse = NextResponse.json(response, { status: 201 })

    // For later when we use httpOnly cookies (for more security)
    /*
    nextResponse.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
    */

    return nextResponse
  } catch (error) {
    console.error("Unexpected error in signup route:", error)

    return NextResponse.json(
      {
        message: "خطای غیرمنتظره‌ای رخ داده است",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    )
  }
}

// For production, we implement rate limiting:
/*
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
  analytics: true,
})

// In POST handler, before processing:
const identifier = body.email
const { success, limit, reset, remaining } = await ratelimit.limit(identifier)

if (!success) {
  return NextResponse.json(
    { message: "تعداد درخواست‌ها بیش از حد مجاز است" },
    { 
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": new Date(reset).toISOString(),
      }
    }
  )
}
*/