import { NextRequest, NextResponse } from "next/server"

interface ConversationRequest {
  user_id: string
  skip: number
  limit: number
  total_conversations: number | null
}

interface Conversation {
  user_id: string
  conversation_id: number
  created_at: string
  updated_at: string
}

interface PaginationInfo {
  skip: number
  limit: number
  total_conversations: number
  has_more: boolean
}

interface ConversationResponse {
  user_conversations: Conversation[]
  pagination: PaginationInfo
}

interface ValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: ConversationRequest = await request.json()

    // Validate required fields
    if (!body.user_id) {
      return NextResponse.json(
        {
          detail: [
            {
              loc: ["body", "user_id"],
              msg: "user_id is required",
              type: "value_error.missing",
            },
          ],
        } as ValidationError,
        { status: 422 }
      )
    }

    // Forward the request to the backend
    const response = await fetch(`${process.env.BASE_URL}/conversations/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if exists
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // Handle error responses
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data as ConversationResponse, { status: 200 })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["server"],
            msg: "Internal server error",
            type: "internal_error",
          },
        ],
      } as ValidationError,
      { status: 500 }
    )
  }
}