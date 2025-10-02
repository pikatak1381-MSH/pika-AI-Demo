import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const skip = searchParams.get("skip") || "0"
        const limit = searchParams.get("limit") || "100"

        if (!userId) {
            return NextResponse.json(
                { error: "Missing userId" },
                {status: 400}
            )
        }

        const res = await fetch(`${process.env.BASE_URL}/sale-agents/user/${userId}?skip=${skip}&limit=${limit}`,
            {
                headers: {Accept: "application/json"},
            }
        )

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { error: data },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching clients:", error)
        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        )
    }
}