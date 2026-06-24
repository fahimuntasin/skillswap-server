import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Payment } from "@/models/payment"

export async function GET() {
  try {
    await connectDB()
    const revenue = await Payment.aggregate([
      { $match: { payment_status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" }, count: { $sum: 1 } } },
    ])
    const monthly = await Payment.aggregate([
      { $match: { payment_status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$paid_at" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ])

    return NextResponse.json({
      totalRevenue: revenue[0]?.totalRevenue || 0,
      totalTransactions: revenue[0]?.count || 0,
      monthly,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch revenue" }, { status: 500 })
  }
}
