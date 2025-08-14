import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getQuestionById, getVisibleTestCases } from "@/lib/questions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const questionId = Number.parseInt(params.id)
    if (isNaN(questionId)) {
      return NextResponse.json({ message: "Invalid question ID" }, { status: 400 })
    }

    const question = getQuestionById(questionId)
    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    // Return question with only visible test cases
    const publicQuestion = {
      ...question,
      testCases: getVisibleTestCases(questionId),
    }

    return NextResponse.json({ question: publicQuestion })
  } catch (error) {
    console.error("Question fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
