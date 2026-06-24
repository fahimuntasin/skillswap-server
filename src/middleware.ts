import { NextResponse } from "next/server"

export function middleware() {
  const response = NextResponse.next()
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3003")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  return response
}

export const config = {
  matcher: "/api/:path*",
}
