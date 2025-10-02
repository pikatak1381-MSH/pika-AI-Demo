import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { user_id } = await request.json()

    if (!user_id) {
      console.error("User is not logged in!")
    }

    const res = await fetch(`${process.env.BASE_URL}/conversations/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.headers.get("authorization") || ""}`
      },
      body: JSON.stringify({ user_id })
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to create conversation" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error creating conversation:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
