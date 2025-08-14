import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getLeaderboard } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const leaderboard = getLeaderboard()

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Leaderboard fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
