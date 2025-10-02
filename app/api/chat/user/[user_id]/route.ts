import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    // Await the params to resolve
    const { user_id } = await context.params;

    // Forwarding skip and limit from client
    const { searchParams } = new URL(req.url);

    const skip = searchParams.get("skip") ?? "0";
    const limit = searchParams.get("limit") ?? "10";

    const res = await fetch(
      `${process.env.BASE_URL}/conversations/user/${user_id}?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user conversations" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
