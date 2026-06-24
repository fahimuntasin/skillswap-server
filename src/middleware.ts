import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  const path = request.nextUrl.pathname
  const protectedPaths = ["/api/tasks", "/api/proposals", "/api/payments", "/api/users", "/api/reviews"]
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)

  if (isProtected && isWrite && !path.includes("/api/auth")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminOnly = path.includes("/api/users") && isWrite
    const adminPaths = ["/api/tasks"] // DELETE only for admin

    if (adminOnly) {
      const user = await auth.api.getSession({ headers: request.headers })
      if (user?.user?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
  }

  return response
}

export const config = {
  matcher: "/api/:path*",
}
