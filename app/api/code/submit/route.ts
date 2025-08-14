import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { GradingSystem } from "@/lib/grading-system"

export async function POST(request: NextRequest) {
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

    const { questionId, code, language } = await request.json()

    if (!questionId || !code || !language) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (!["java", "cpp"].includes(language)) {
      return NextResponse.json({ message: "Invalid language" }, { status: 400 })
    }

    const gradingSystem = GradingSystem.getInstance()
    const result = await gradingSystem.gradeSubmission(user.id, questionId, code, language)

    return NextResponse.json({
      success: true,
      submissionId: result.submissionId,
      score: result.score,
      totalScore: result.totalScore,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      results: result.results,
    })
  } catch (error) {
    console.error("Code submission error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
