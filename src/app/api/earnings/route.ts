import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Payment } from "@/models/payment"
import { Task } from "@/models/task"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const payments = await Payment.find({ freelancer_email: email, payment_status: "completed" })
      .sort({ paid_at: -1 })

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0)

    const tasks = await Task.find({ _id: { $in: payments.map(p => p.task_id) } }).lean()
    const enriched = payments.map(p => {
      const task = tasks.find(t => t._id.toString() === p.task_id.toString())
      return { ...p.toObject(), taskTitle: task?.title || "Unknown task" }
    })

    return NextResponse.json({ earnings: enriched, totalEarnings })
  } catch {
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 })
  }
}
