import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getAllQuestions } from "@/lib/questions"

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

    const questions = getAllQuestions()

    // Return questions without hidden test cases for security
    const publicQuestions = questions.map((q) => ({
      ...q,
      testCases: q.testCases.filter((tc) => tc.isVisible),
    }))

    return NextResponse.json({
      questions: publicQuestions,
      total: questions.length,
    })
  } catch (error) {
    console.error("Questions fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
