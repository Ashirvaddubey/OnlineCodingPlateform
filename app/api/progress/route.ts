import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserProgress } from "@/lib/database"

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

    const progress = getUserProgress(user.id)

    return NextResponse.json({
      progress: {
        completedQuestions: progress.completedQuestions.length,
        totalQuestions: 15,
        score: progress.totalScore,
        timeRemaining: progress.timeRemaining,
      },
    })
  } catch (error) {
    console.error("Progress fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
