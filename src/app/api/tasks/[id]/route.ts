import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/models/task"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const task = await Task.findById(id)
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}
