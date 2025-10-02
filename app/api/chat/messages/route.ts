import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { conversation_id, context } = await request.json()

    if (!conversation_id || !context) {
      return NextResponse.json({ error: "Missing conversation_id or prompt" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")

    const res = await fetch(`${process.env.BASE_URL}/messages/input`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify({ conversation_id, context }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("FastAPI error:", errorText)
      return NextResponse.json(
        { error: "Failed to send prompt", details: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error sending message:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}