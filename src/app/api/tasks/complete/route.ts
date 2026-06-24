import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/models/task"
import { Proposal } from "@/models/proposal"

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const { status, deliverable_url } = await req.json()

    const update: Record<string, unknown> = {}
    if (status) update.status = status
    if (deliverable_url !== undefined) update.deliverable_url = deliverable_url

    const task = await Task.findByIdAndUpdate(id, update, { new: true })
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

    if (status === "completed") {
      await Proposal.updateMany({ task_id: id, status: "pending" }, { status: "rejected" })
    }

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Failed to update task status" }, { status: 500 })
  }
}
