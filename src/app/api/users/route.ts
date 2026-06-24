import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const limit = parseInt(searchParams.get("limit") || "10")

    const filter: Record<string, unknown> = {}
    if (role) filter.role = role

    const users = await User.find(filter).select("-password").limit(limit).sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const { isBlocked } = await req.json()
    const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
