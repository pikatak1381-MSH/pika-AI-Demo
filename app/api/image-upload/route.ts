import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const {
            product_name,
            product_description,
            pikatak_category_id,
            images
        } = await request.json()
        
        if (!product_name || !product_description || !pikatak_category_id || !images) {
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 },
            )
        }

        const res = await fetch("https://www.pikatak.org/PikaSnap-2/detection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ product_name, product_description, pikatak_category_id, images })
        })

        if (!res.ok) {
            const errText = await res.text()
            console.error("FastAPI error:", errText)
            return NextResponse.json(
                { error: "Failed to submit image form" },
                { status: res.status }
            )
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error sending image form", error)
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}