import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { 
            sale_agent_name,
            phone_number,
            tax_number,
            registration_number,
            postal_code,
            national_id,
            address,
            user_id,
        } = await request.json()

        const res = await fetch(`${process.env.BASE_URL}/sale-agents/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ 
                sale_agent_name,
                phone_number,
                tax_number,
                registration_number,
                postal_code,
                national_id,
                address,
                user_id,
            })
        })

        const data = await res.json()

        if (!res.ok) {
            console.error("FastAPI error:", data)

            return NextResponse.json(
                { error: data },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error creating client", error)
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}