import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Proposal } from "@/models/proposal"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get("task_id")
    const freelancerEmail = searchParams.get("freelancer_email")

    const filter: Record<string, unknown> = {}
    if (taskId) filter.task_id = taskId
    if (freelancerEmail) filter.freelancer_email = freelancerEmail

    const proposals = await Proposal.find(filter).sort({ submitted_at: -1 })
    return NextResponse.json(proposals)
  } catch {
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()
    const existing = await Proposal.findOne({
      task_id: data.task_id,
      freelancer_email: data.freelancer_email,
    })
    if (existing) {
      return NextResponse.json({ error: "You already submitted a proposal for this task" }, { status: 400 })
    }
    const proposal = await Proposal.create(data)
    return NextResponse.json(proposal, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to submit proposal" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const { status } = await req.json()
    const proposal = await Proposal.findByIdAndUpdate(id, { status }, { new: true })
    if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    return NextResponse.json(proposal)
  } catch {
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
  }
}
