import { CodeExecutor } from "./code-executor"
import { getQuestionById } from "./questions"
import { saveSubmission, updateUserProgress, getUserProgress } from "./database"
import type { UserSubmission, TestResult } from "./database"

export interface GradingResult {
  submissionId: string
  score: number
  totalScore: number
  passedTests: number
  totalTests: number
  results: TestResult[]
}

export class GradingSystem {
  private static instance: GradingSystem
  private executor: CodeExecutor

  constructor() {
    this.executor = CodeExecutor.getInstance()
  }

  static getInstance(): GradingSystem {
    if (!GradingSystem.instance) {
      GradingSystem.instance = new GradingSystem()
    }
    return GradingSystem.instance
  }

  async gradeSubmission(
    userId: string,
    questionId: number,
    code: string,
    language: "java" | "cpp",
  ): Promise<GradingResult> {
    const question = getQuestionById(questionId)
    if (!question) {
      throw new Error("Question not found")
    }

    // Execute code against all test cases (including hidden ones)
    const executionResult = await this.executor.executeCode(code, language, questionId, true)

    if (!executionResult.success) {
      // Handle compilation or execution errors
      const submission: UserSubmission = {
        id: this.generateSubmissionId(),
        userId,
        questionId,
        code,
        language,
        status: "error",
        score: 0,
        testResults: [],
        submittedAt: new Date(),
      }

      saveSubmission(submission)

      return {
        submissionId: submission.id,
        score: 0,
        totalScore: question.points,
        passedTests: 0,
        totalTests: question.testCases.length,
        results: [],
      }
    }

    // Calculate score based on passed test cases
    const passedTests = executionResult.results.filter((r) => r.passed).length
    const totalTests = executionResult.results.length
    const score = Math.floor((passedTests / totalTests) * question.points)

    // Save submission
    const submission: UserSubmission = {
      id: this.generateSubmissionId(),
      userId,
      questionId,
      code,
      language,
      status: "completed",
      score,
      testResults: executionResult.results,
      submittedAt: new Date(),
    }

    saveSubmission(submission)

    // Update user progress
    const currentProgress = getUserProgress(userId)
    const newCompletedQuestions = [...currentProgress.completedQuestions]
    if (!newCompletedQuestions.includes(questionId)) {
      newCompletedQuestions.push(questionId)
    }

    updateUserProgress(userId, {
      completedQuestions: newCompletedQuestions,
      totalScore: currentProgress.totalScore + score,
    })

    return {
      submissionId: submission.id,
      score,
      totalScore: currentProgress.totalScore + score,
      passedTests,
      totalTests,
      results: executionResult.results,
    }
  }

  async runCode(
    userId: string,
    questionId: number,
    code: string,
    language: "java" | "cpp",
  ): Promise<{ results: TestResult[]; error?: string }> {
    // Execute code against only visible test cases
    const executionResult = await this.executor.executeCode(code, language, questionId, false)

    if (!executionResult.success) {
      return {
        results: [],
        error: executionResult.error || executionResult.compilationError,
      }
    }

    return {
      results: executionResult.results,
    }
  }

  private generateSubmissionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Calculate final grade based on overall performance
  calculateFinalGrade(totalScore: number, maxPossibleScore: number): string {
    const percentage = (totalScore / maxPossibleScore) * 100

    if (percentage >= 90) return "A+"
    if (percentage >= 85) return "A"
    if (percentage >= 80) return "A-"
    if (percentage >= 75) return "B+"
    if (percentage >= 70) return "B"
    if (percentage >= 65) return "B-"
    if (percentage >= 60) return "C+"
    if (percentage >= 55) return "C"
    if (percentage >= 50) return "C-"
    if (percentage >= 45) return "D+"
    if (percentage >= 40) return "D"
    return "F"
  }

  // Get performance analytics
  getPerformanceAnalytics(userId: string): {
    totalSubmissions: number
    averageScore: number
    strongCategories: string[]
    weakCategories: string[]
  } {
    // This would analyze user's submissions and provide insights
    // Mock implementation for now
    return {
      totalSubmissions: 0,
      averageScore: 0,
      strongCategories: [],
      weakCategories: [],
    }
  }
}
