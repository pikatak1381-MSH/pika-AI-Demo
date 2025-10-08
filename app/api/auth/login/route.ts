import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const baseUrl = process.env.BASE_URL

  if (!baseUrl) {
    return NextResponse.json(
      { error: "BASE_URL not set" },
      { status: 500 }
    )
  }

  let res
  try {
    res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Accept: "application/json",
       },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach backend", details: String(err) }, 
      { status: 500 } 
    )
  }
  
  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message || "ورود موفقیت آمیز نبود" }, 
      { status: res.status }
    )
  }

  return NextResponse.json(data)
}