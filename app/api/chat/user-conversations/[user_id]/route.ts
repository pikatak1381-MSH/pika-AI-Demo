import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ user_id: string }>
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { user_id } = await context.params

    // Validate user_id
    if (!user_id || user_id === "undefined") {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const skip = parseInt(searchParams.get("skip") ?? "0", 10)
    const limit = parseInt(searchParams.get("limit") ?? "20", 10)

    // Validating pagination params
    if (isNaN(skip) || skip < 0 || isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      )
    }

    const backendUrl = `${process.env.BASE_URL}/conversations/user/${user_id}?skip=${skip}&limit=${limit}`
    
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 seconds
    })

    if (!res.ok) {
      console.error(`Backend error: ${res.status} for user ${user_id}`)
      
      return NextResponse.json(
        { 
          error: "Failed to fetch user conversations",
          status: res.status 
        },
        { status: res.status }
      )
    }

    const data = await res.json()
    
    // Transforming backend response to include pagination metadata
    const conversations = Array.isArray(data) ? data : data.conversations || []
    const total = data.total ?? conversations.length
    
    const response = {
      data: conversations,
      pagination: {
        skip,
        limit,
        total,
        hasMore: skip + conversations.length < total,
      },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("API Route Error:", error)
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timeout" },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}