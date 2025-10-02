// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const token = request.headers.get("authorization")

  // Sending logout request to real backend
  const res = await fetch("https://pikatak.org/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body: JSON.stringify({}), // empty body
  })

  // Handle non-200 responses
  if (!res.ok) {
    let message = "خروج موفقیت آمیز نبود."
    const text = await res.text()
    if (text) {
      try {
        const data = JSON.parse(text)
        message = data.message ?? message
      } catch {
        // fallback to default message
      }
    }
    return NextResponse.json({ message }, { status: res.status })
  }

  // Always return JSON for frontend
  return NextResponse.json({ message: "Logged out successfully" })
}
