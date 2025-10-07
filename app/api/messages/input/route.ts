import { NextRequest, NextResponse } from "next/server"

/* ----------------------------- Types ----------------------------- */
interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

interface FastAPIValidationErrorResponse {
  detail: ValidationError[]
}

interface MessageInputRequest {
  context: string
  conversation_id?: number
  user_id?: string | null
}

interface MessageInputResponse {
  is_success: boolean
  intro_answer: string
  offered_product_answer: Record<string, unknown>[]
  summary_answer: string
  available_flow_id: number
  is_locked: boolean
  context: string
  answer_id: number
  conversation_id: number
  input_message_id: number
}

/* ----------------------------- Helpers ----------------------------- */
function isValidMessageInput(body: unknown): body is MessageInputRequest {
  if (typeof body !== "object" || body === null) return false
  
  const data = body as Record<string, unknown>
  
  return (
    typeof data.context === "string" &&
    (typeof data.conversation_id === "number" || data.conversation_id === null) &&
    typeof data.user_id === "string"
  )
}

function createErrorResponse(
  message: string,
  status: number,
  details?: Record<string, unknown>
) {
  const response: Record<string, unknown> = {
    error: message,
    timestamp: new Date().toISOString(),
  }

  if (details) {
    response.details = details
  }

  return NextResponse.json(response, { status })
}

/* ----------------------------- Route Handler ----------------------------- */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Validate environment variables
    const baseUrl = process.env.BASE_URL
    if (!baseUrl) {
      console.error("[API] BASE_URL environment variable is not configured")
      return createErrorResponse("Service configuration error", 500)
    }

    // Extract and validate authorization token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createErrorResponse("Missing or invalid authorization header", 401)
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch (error) {
      return createErrorResponse("Invalid JSON in request body", 400)
    }

    if (!isValidMessageInput(body)) {
      return createErrorResponse(
        "Invalid request body",
        400,
        {
          required: ["context (string)", "conversation_id (number | null)", "user_id (string)"],
          received: body,
        }
      )
    }

    // Log request (avoid logging sensitive data in production)
    if (process.env.NODE_ENV === "development") {
      console.log("[API] Sending message:", {
        conversation_id: body.conversation_id,
        user_id: body.user_id,
        context_length: body.context.length,
        is_new_conversation: body.conversation_id === null,
      })
    }

    // Make request to FastAPI backend
    const backendUrl = `${baseUrl}/messages/input`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    let response: Response
    try {
      response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === "AbortError") {
        console.error("[API] Request timeout after 30s")
        return createErrorResponse("Request timeout", 504)
      }
      
      console.error("[API] Network error:", error)
      return createErrorResponse("Failed to connect to backend service", 503)
    } finally {
      clearTimeout(timeoutId)
    }

    // Handle non-OK responses
    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      
      // Handle FastAPI validation errors (422)
      if (response.status === 422 && contentType?.includes("application/json")) {
        try {
          const errorData = await response.json() as FastAPIValidationErrorResponse
          
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail.map(err => ({
              field: err.loc.join("."),
              message: err.msg,
              type: err.type,
            }))
            
            console.warn("[API] Validation error:", validationErrors)
            
            return NextResponse.json(
              {
                error: "Validation error",
                validation_errors: validationErrors,
                timestamp: new Date().toISOString(),
              },
              { status: 422 }
            )
          }
        } catch (parseError) {
          console.error("[API] Failed to parse validation error response")
        }
      }

      // Handle other error responses
      let errorMessage = `Backend returned ${response.status}`
      let errorBody = ""
      try {
        const errorText = await response.text()
        if (errorText) {
          errorBody = errorText.substring(0, 500)
          errorMessage += `: ${errorBody}`
        }
      } catch {
        // Ignore error text parsing failures
      }

      console.error("[API] Backend error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        url: backendUrl,
      })

      return createErrorResponse(
        "Backend service error",
        response.status >= 500 ? 502 : response.status
      )
    }

    // Parse successful response
    let data: MessageInputResponse
    try {
      data = await response.json()
    } catch (error) {
      console.error("[API] Failed to parse success response:", error)
      return createErrorResponse("Invalid response from backend", 502)
    }

    // Validate response structure
    if (!data.is_success || typeof data.conversation_id !== "number") {
      console.error("[API] Invalid response structure:", data)
      return createErrorResponse("Invalid response from backend", 502)
    }

    // Log success metrics
    const duration = Date.now() - startTime
    if (process.env.NODE_ENV === "development") {
      console.log("[API] Request successful:", {
        conversation_id: data.conversation_id,
        answer_id: data.answer_id,
        duration_ms: duration,
      })
    }

    // Return successful response
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    })

  } catch (error) {
    // Catch-all error handler
    console.error("[API] Unexpected error:", error)
    
    return createErrorResponse(
      "Internal server error",
      500,
      process.env.NODE_ENV === "development" 
        ? { error: error instanceof Error ? error.message : "Unknown error" }
        : undefined
    )
  }
}

// Export route segment config
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30 // seconds