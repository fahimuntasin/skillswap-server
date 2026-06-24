import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/models/task"
import { Proposal } from "@/models/proposal"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const clientEmail = searchParams.get("client_email")

    if (!clientEmail) return NextResponse.json({ error: "Client email required" }, { status: 400 })

    const tasks = await Task.find({ client_email: clientEmail }).sort({ createdAt: -1 })
    return NextResponse.json(tasks)
  } catch {
    return NextResponse.json({ error: "Failed to fetch client tasks" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const data = await req.json()

    const task = await Task.findByIdAndUpdate(id, data, { new: true })
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

    if (data.status === "completed") {
      await Proposal.updateMany({ task_id: id, status: "pending" }, { status: "rejected" })
    }

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}
