import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { Review } from "@/models/review"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")

    const freelancers = await User.find({ role: "freelancer", isBlocked: false })
      .select("-password")
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    const withRatings = await Promise.all(
      freelancers.map(async (f) => {
        const reviews = await Review.find({ reviewee_email: f.email })
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0
        return { ...f, rating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length }
      })
    )

    return NextResponse.json(withRatings)
  } catch {
    return NextResponse.json({ error: "Failed to fetch freelancers" }, { status: 500 })
  }
}
