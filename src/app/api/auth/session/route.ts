import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return NextResponse.json({ user: null })
    return NextResponse.json(session)
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
