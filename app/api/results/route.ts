import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getSubmissionsByUser, getUserProgress } from "@/lib/database"
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

    const submissions = getSubmissionsByUser(user.id)
    const progress = getUserProgress(user.id)
    const questions = getAllQuestions()

    // Calculate time spent (mock - in production, track actual time)
    const timeSpent = 7200 - progress.timeRemaining

    // Format submissions for results display
    const formattedSubmissions = submissions.map((sub) => {
      const question = questions.find((q) => q.id === sub.questionId)
      return {
        questionId: sub.questionId,
        questionTitle: question?.title || "Unknown Question",
        score: sub.score,
        maxScore: question?.points || 0,
        language: sub.language,
        passedTests: sub.testResults.filter((r) => r.passed).length,
        totalTests: sub.testResults.length,
        submittedAt: sub.submittedAt.toISOString(),
      }
    })

    const results = {
      totalScore: progress.totalScore,
      completedQuestions: progress.completedQuestions.length,
      totalQuestions: questions.length,
      timeSpent,
      submissions: formattedSubmissions,
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Results fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
