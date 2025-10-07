import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Types & Validation Schemas
const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "رمز عبور فعلی را وارد کنید"),
    new_password: z
      .string()
      .min(8, "رمز عبور جدید باید حداقل 8 کاراکتر باشد")
      .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
      .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/\d/, "رمز عبور باید حداقل یک عدد داشته باشد"),
    user_id: z.string().uuid("شناسه کاربر نامعتبر است"),
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد",
    path: ["new_password"],
  })

type ChangePasswordRequest = z.infer<typeof changePasswordSchema>

interface BackendUserResponse {
  email: string
  preferred_name: string
  user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface BackendValidationError {
  detail?: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
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
  data: BackendValidationError
): ApiError => {
  if (data.detail && Array.isArray(data.detail)) {
    const firstError = data.detail[0]
    const message = firstError?.msg || "خطای اعتبارسنجی"
    return new ApiError(message, status, "VALIDATION_ERROR")
  }

  const message = data.message || data.error || "خطای نامشخص"

  switch (status) {
    case 400:
        if (message.toLowerCase().includes("password")) {
            return new ApiError(
                "رمز عبور فعلی اشتباه است",
                400,
                "INVALID_PASSWORD"
            )
        }
        return new ApiError(message, 400, "BAD_REQUEST")

    case 401:
        return new ApiError("احراز هویت ناموفق بود", 401, "UNAUTHORIZED")

    case 403:
        return new ApiError("دسترسی غیرمجاز", 403, "FORBIDDEN")

    case 404:
        return new ApiError("کاربر یافت نشد", 404, "USER_NOT_FOUND")

    case 422:
        return new ApiError("اطلاعات ورودی نامعتبر است", 422, "INVALID_INPUT")

    case 429:
        return new ApiError(
            "تعداد درخواست‌های زیاد. لطفاً بعداً تلاش کنید",
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

// Authentication Helper
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  
  if (!authHeader) {
    return null
  }

  // Supporting both "Bearer token" and "token" formats
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return authHeader
}

// API Route Handler
export async function PUT(request: NextRequest) {
  try {
    const token = extractToken(request)

    if (!token) {
      return NextResponse.json(
        {
          message: "توکن احراز هویت یافت نشد",
          code: "MISSING_TOKEN",
        },
        { status: 401 }
      )
    }

    let body: ChangePasswordRequest

    try {
      const rawBody = await request.json()
      body = changePasswordSchema.parse(rawBody)
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
    const url = `${baseURL}/users/${body.user_id}/change-password`

    let backendResponse: Response

    try {
      backendResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: body.current_password,
          new_password: body.new_password,
        }),
      })
    } catch (error) {
      console.error("Network error calling backend API:", error)
      return NextResponse.json(
        {
          message: "خطا در برقراری ارتباط با سرور",
          code: "NETWORK_ERROR",
        },
        { status: 503 }
      )
    }

    if (!backendResponse.ok) {
      let errorData: BackendValidationError = {}

      try {
        errorData = await backendResponse.json()
      } catch {
        errorData = { message: backendResponse.statusText }
      }

      const apiError = handleBackendError(backendResponse.status, errorData)

      // Log for monitoring
      console.error("Backend API error:", {
        status: backendResponse.status,
        error: errorData,
        userId: body.user_id,
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

    return NextResponse.json(
      {
        message: "رمز عبور با موفقیت تغییر یافت",
        user: {
          user_id: userData.user_id,
          email: userData.email,
          preferred_name: userData.preferred_name,
          is_active: userData.is_active,
          updated_at: userData.updated_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error in change-password route:", error)

    return NextResponse.json(
      {
        message: "خطای غیرمنتظره‌ای رخ داده است",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    )
  }
}

// Rejecting other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  )
}

export async function POST() {
  return NextResponse.json(
    { message: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  )
}