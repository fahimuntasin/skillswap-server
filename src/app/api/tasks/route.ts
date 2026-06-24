import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Task } from "@/models/task"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "9")
    const category = searchParams.get("category") || ""
    const search = searchParams.get("search") || ""

    const filter: Record<string, unknown> = { status: "open" }
    if (category && category !== "All") filter.category = category
    if (search) filter.title = { $regex: search, $options: "i" }

    const total = await Task.countDocuments(filter)
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json({ tasks, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()
    const task = await Task.create(data)
    return NextResponse.json(task, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const data = await req.json()
    const task = await Task.findByIdAndUpdate(id, data, { new: true })
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    return NextResponse.json(task)
  } catch (err) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    await Task.findByIdAndDelete(id)
    return NextResponse.json({ message: "Task deleted" })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
