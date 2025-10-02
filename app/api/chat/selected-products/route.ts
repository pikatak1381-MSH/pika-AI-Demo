import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { conversation_id, input_message_id, proformal_invoice } = await request.json()

    if (!conversation_id || !input_message_id || !proformal_invoice) {
      return NextResponse.json({ error: "Missing conversation_id, input_message_id or selected products" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")

    const res = await fetch(`${process.env.BASE_URL}/messages/selected-products-by-user`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify({ conversation_id, input_message_id, proformal_invoice }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("FastAPI error:", errText)
      return NextResponse.json({ error: "Failed to submit selected products" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}