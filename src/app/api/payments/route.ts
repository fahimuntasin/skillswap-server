import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { connectDB } from "@/lib/db"
import { Payment } from "@/models/payment"
import { Task } from "@/models/task"
import { Proposal } from "@/models/proposal"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { taskId, proposalId, amount, clientEmail, freelancerEmail } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: clientEmail,
      line_items: [{ price_data: { currency: "usd", product_data: { name: "Task Payment" }, unit_amount: Math.round(amount * 100) }, quantity: 1 }],
      metadata: { taskId, proposalId, freelancerEmail, clientEmail },
      success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"}/dashboard/client`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const { taskId, proposalId, freelancerEmail, clientEmail } = session.metadata!

    const existing = await Payment.findOne({ transaction_id: sessionId })
    if (existing) return NextResponse.json(existing)

    const payment = await Payment.create({
      client_email: clientEmail,
      freelancer_email: freelancerEmail,
      task_id: taskId,
      amount: session.amount_total! / 100,
      transaction_id: sessionId,
      payment_status: "completed",
    })

    await Task.findByIdAndUpdate(taskId, { status: "in_progress" })
    await Proposal.findByIdAndUpdate(proposalId, { status: "accepted" })

    return NextResponse.json(payment)
  } catch (err) {
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const payments = await Payment.find().sort({ paid_at: -1 })
    return NextResponse.json(payments)
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
