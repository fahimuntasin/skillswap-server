import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Review } from "@/models/review"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get("task_id")
    const revieweeEmail = searchParams.get("reviewee_email")

    const filter: Record<string, unknown> = {}
    if (taskId) filter.task_id = taskId
    if (revieweeEmail) filter.reviewee_email = revieweeEmail

    const reviews = await Review.find(filter).sort({ created_at: -1 })
    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()
    const review = await Review.create(data)
    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
