import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 })

    const { isBlocked } = await req.json()
    const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true }).select("-password")
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json({ message: `User ${isBlocked ? "blocked" : "unblocked"}` })
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
