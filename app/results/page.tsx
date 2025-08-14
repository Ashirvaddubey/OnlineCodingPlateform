"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Home, Download, CheckCircle, XCircle, Clock } from "lucide-react"

interface ResultSummary {
  totalScore: number
  completedQuestions: number
  totalQuestions: number
  timeSpent: number
  submissions: SubmissionResult[]
}

interface SubmissionResult {
  questionId: number
  questionTitle: string
  score: number
  maxScore: number
  language: string
  passedTests: number
  totalTests: number
  submittedAt: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<ResultSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/"
      return
    }

    fetch("/api/results", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setResults(data.results)
          const overallPercentage = (data.results.totalScore / (data.results.totalQuestions * 25)) * 100
          if (overallPercentage >= 70) {
            setTimeout(() => setShowCelebration(true), 1000)
            setTimeout(() => setShowCelebration(false), 4000)
          }
        }
      })
      .catch(() => {
        window.location.href = "/"
      })
      .finally(() => setIsLoading(false))
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMotivationalMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! You're a coding superstar! 🌟", color: "text-yellow-600" }
    if (percentage >= 80)
      return { message: "Excellent work! You've mastered these concepts! 🎉", color: "text-green-600" }
    if (percentage >= 70) return { message: "Great job! You're on the right track! 👏", color: "text-blue-600" }
    if (percentage >= 60) return { message: "Good effort! Keep practicing to improve! 💪", color: "text-purple-600" }
    if (percentage >= 50)
      return { message: "Nice try! Review the concepts and try again! 📚", color: "text-orange-600" }
    return { message: "Don't give up! Every expert was once a beginner! 🚀", color: "text-red-600" }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-muted-foreground">Calculating your results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const overallPercentage = (results.totalScore / (results.totalQuestions * 25)) * 100
  const motivationalMessage = getMotivationalMessage(overallPercentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {showCelebration && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center animate-in zoom-in-95 duration-500 max-w-md">
            <div className="text-6xl mb-4">🎊</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Congratulations!</h3>
            <p className="text-muted-foreground mb-4">You've completed the coding test with great results!</p>
            <div className="text-4xl font-bold text-green-600 mb-2">{Math.round(overallPercentage)}%</div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
        </div>
      )}

      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Test Results
                </h1>
                <p className="text-lg text-muted-foreground">Your coding assessment performance</p>
                <p className={`text-sm font-medium mt-1 ${motivationalMessage.color}`}>{motivationalMessage.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white dark:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{results.totalScore}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Score</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Points Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{results.completedQuestions}</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">Questions Completed</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">Out of {results.totalQuestions}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round((results.completedQuestions / results.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Completion Rate</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Questions Attempted</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Time Spent</div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Total Duration</div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Overall Performance</CardTitle>
              <CardDescription>Your performance breakdown across all questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Questions Completed</span>
                  <span className="font-medium">
                    {results.completedQuestions} / {results.totalQuestions}
                  </span>
                </div>
                <Progress value={(results.completedQuestions / results.totalQuestions) * 100} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {results.submissions.filter((s) => s.passedTests === s.totalTests).length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">Perfect Scores</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">100% Test Cases</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {results.submissions.reduce((acc, s) => acc + s.passedTests, 0)}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Tests Passed</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across All Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🏆 Performance Grade</CardTitle>
              <CardDescription>Based on your overall score</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {(() => {
                  if (overallPercentage >= 90) return "A+"
                  if (overallPercentage >= 80) return "A"
                  if (overallPercentage >= 70) return "B+"
                  if (overallPercentage >= 60) return "B"
                  if (overallPercentage >= 50) return "C"
                  return "D"
                })()}
              </div>
              <div className="text-lg font-medium text-muted-foreground mb-2">
                {Math.round(overallPercentage)}% Overall
              </div>
              <div className="text-sm text-muted-foreground">
                {overallPercentage >= 80
                  ? "Excellent Performance!"
                  : overallPercentage >= 60
                    ? "Good Work!"
                    : "Keep Practicing!"}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📝 Question-wise Results</CardTitle>
                <CardDescription>Detailed breakdown of your performance on each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.submissions.map((submission) => (
                    <div
                      key={submission.questionId}
                      className="border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {submission.passedTests === submission.totalTests ? (
                              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                                <XCircle className="h-5 w-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-lg">Question {submission.questionId}</span>
                              <p className="text-sm text-muted-foreground">{submission.questionTitle}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white dark:bg-gray-800">
                            {submission.language.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={
                              submission.passedTests === submission.totalTests
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }
                          >
                            {submission.passedTests}/{submission.totalTests} tests
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="text-sm text-muted-foreground mb-1">Score</div>
                          <div className={`text-2xl font-bold ${getScoreColor(submission.score, submission.maxScore)}`}>
                            {submission.score} / {submission.maxScore}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round((submission.score / submission.maxScore) * 100)}%
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="text-sm text-muted-foreground mb-1">Test Cases</div>
                          <div className="text-2xl font-bold">
                            {submission.passedTests} / {submission.totalTests}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round((submission.passedTests / submission.totalTests) * 100)}% passed
                          </div>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="text-sm text-muted-foreground mb-1">Submitted</div>
                          <div className="text-lg font-bold flex items-center justify-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(submission.submittedAt).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Progress value={(submission.passedTests / submission.totalTests) * 100} className="h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
