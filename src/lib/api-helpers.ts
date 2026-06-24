import { NextResponse } from "next/server"

export function apiError(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function apiSuccess(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function handleApiError(err: unknown) {
  console.error("API Error:", err)
  return apiError("Internal server error")
}
