import { NextResponse, type NextRequest } from "next/server"

interface Params { 
    id: string 
}

const BASE_URL = process.env.BASE_URL || "https://pikatak.org/api"

export async function PUT(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
    try {
        const { id } = await context.params
        const body = await request.json()

        const res = await fetch(`${BASE_URL}/clients/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to update client" },
                { status: res.status }
            )
        }

        const data = await res.json()
        return NextResponse.json(data)        
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }
        return NextResponse.json(
            { error: "Unknown error" },
            { status: 500 }
        )        
    }

}


export async function DELETE(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
    try {
        const { id } = await context.params

        const res = await fetch(`${BASE_URL}/clients/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            const error = await res.json()
            return NextResponse.json(error, { status: res.status })
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }
        return NextResponse.json(
            { error: "Unknown error" },
            { status: 500 }
        )
    }
}