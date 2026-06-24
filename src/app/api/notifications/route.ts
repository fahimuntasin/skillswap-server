import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    notifications: [
      { id: "1", message: "New proposal received for your task", type: "info", time: "2 min ago" },
      { id: "2", message: "Your proposal was accepted!", type: "success", time: "1 hour ago" },
      { id: "3", message: "Payment of $80 received", type: "success", time: "3 hours ago" },
    ],
    unread: 3,
  })
}
