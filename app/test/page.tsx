"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Send,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Home,
} from "lucide-react"
import { useTheme } from "next-themes"
import { CodeEditor } from "@/components/code-editor"
import type { Question } from "@/lib/questions"

interface TestResult {
  testCaseIndex: number
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  executionTime: number
  isVisible: boolean
}

interface RunResult {
  success: boolean
  results: TestResult[]
  error?: string
}

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [language, setLanguage] = useState<"java" | "cpp">("java")
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [runResults, setRunResults] = useState<TestResult[]>([])
  const [submitResults, setSubmitResults] = useState<TestResult[]>([])
  const [timeRemaining, setTimeRemaining] = useState(7200) // 2 hours
  const [score, setScore] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set())
  const { theme, setTheme } = useTheme()
  const [showCelebration, setShowCelebration] = useState(false)
  const [lastSubmissionScore, setLastSubmissionScore] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/"
      return
    }

    // Load questions
    fetch("/api/questions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions)
          loadDefaultCode(data.questions[0], language)
        }
      })
      .catch(() => {
        window.location.href = "/"
      })

    // Load progress
    loadProgress()

    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (currentQuestion) {
      loadDefaultCode(currentQuestion, language)
      setRunResults([])
      setSubmitResults([])
    }
  }, [currentQuestionIndex, language])

  const loadProgress = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.progress) {
        setScore(data.progress.score)
        setTimeRemaining(data.progress.timeRemaining)
      }
    } catch (error) {
      console.error("Failed to load progress:", error)
    }
  }

  const loadDefaultCode = (question: Question, lang: "java" | "cpp") => {
    if (lang === "java") {
      setCode(`// Question ${question.id}: ${question.title}
// Language: Java
// Implement your solution below

public class Solution {
    public static void main(String[] args) {
        // Your code here
        
    }
}`)
    } else {
      setCode(`// Question ${question.id}: ${question.title}
// Language: C++
// Implement your solution below

#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`)
    }
  }

  const handleRunCode = async () => {
    if (!currentQuestion) return

    setIsRunning(true)
    setRunResults([])

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/code/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          code,
          language,
        }),
      })

      const data = await response.json()
      if (data.results) {
        setRunResults(data.results.filter((r: TestResult) => r.isVisible))
      }
    } catch (error) {
      console.error("Run error:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!currentQuestion) return

    setIsSubmitting(true)
    setSubmitResults([])

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/code/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          code,
          language,
        }),
      })

      const data = await response.json()
      if (data.success) {
        const questionScore = Math.round(
          (data.results.filter((r: TestResult) => r.passed).length / data.results.length) * currentQuestion.points,
        )
        setLastSubmissionScore(questionScore)
        setScore(data.totalScore)
        setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]))
        if (data.results) {
          setSubmitResults(data.results)
        }

        if (questionScore >= currentQuestion.points * 0.8) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      }
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleFinishTest = async () => {
    // Submit current question if not already submitted
    if (!completedQuestions.has(currentQuestion.id)) {
      await handleSubmit()
    }

    // Redirect to results page
    setTimeout(() => {
      window.location.href = "/results"
    }, 2000) // Give time to see final submission results
  }

  const handleTimeUp = () => {
    // Auto-submit current code and redirect to results
    window.location.href = "/results"
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeRemaining < 300) return "text-red-600" // Less than 5 minutes
    if (timeRemaining < 1800) return "text-orange-600" // Less than 30 minutes
    return "text-green-600"
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading your coding challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/dashboard")}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                Question {currentQuestion.id} of {questions.length}
              </Badge>
              <Badge
                variant={completedQuestions.has(currentQuestion.id) ? "default" : "secondary"}
                className={
                  completedQuestions.has(currentQuestion.id)
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : ""
                }
              >
                {completedQuestions.has(currentQuestion.id) ? "✓ Completed" : currentQuestion.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm">
              <Clock className="h-4 w-4" />
              <span className={`font-mono text-sm font-medium ${getTimeColor()}`}>{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded-full border shadow-sm">
              <span className="text-muted-foreground">Score: </span>
              <span className="font-bold text-blue-600">{score}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((completedQuestions.size / questions.length) * 100)}%
            </span>
          </div>
          <Progress
            value={(completedQuestions.size / questions.length) * 100}
            className="h-3 bg-gray-200 dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{completedQuestions.size} completed</span>
            <span>{questions.length - completedQuestions.size} remaining</span>
          </div>
        </div>
      </header>

      {showCelebration && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center animate-in zoom-in-95 duration-500">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Excellent Work!</h3>
            <p className="text-muted-foreground mb-4">You scored {lastSubmissionScore} points on this question!</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Keep up the great coding!</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Panel - Question */}
        <div className="lg:w-1/2 w-full border-r-0 lg:border-r bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm overflow-auto flex-shrink-0">
          <div className="p-4 lg:p-6 h-full">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {currentQuestion.title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80">
                    {currentQuestion.category}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  >
                    {currentQuestion.points} points
                  </Badge>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Read the constraints carefully and test with the sample input before
                    submitting.
                  </p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none dark:prose-invert bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl border backdrop-blur-sm">
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.description.replace(/\n/g, "<br>") }} />
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl border backdrop-blur-sm">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Constraints:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {currentQuestion.constraints.map((constraint, index) => (
                    <li key={index} className="leading-relaxed">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold mb-2 text-green-800 dark:text-green-300">Sample Input:</h3>
                  <pre className="bg-white dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto border">
                    {currentQuestion.sampleInput}
                  </pre>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Sample Output:</h3>
                  <pre className="bg-white dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto border">
                    {currentQuestion.sampleOutput}
                  </pre>
                </div>
              </div>

              {(runResults.length > 0 || submitResults.length > 0) && (
                <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl border backdrop-blur-sm">
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    {submitResults.length > 0 ? "🎯 Submission Results:" : "🧪 Test Results:"}
                  </h3>
                  <div className="space-y-3">
                    {(submitResults.length > 0 ? submitResults : runResults).map((result, index) => (
                      <Card
                        key={index}
                        className={`${result.passed ? "border-green-200 bg-green-50/50 dark:bg-green-900/10" : "border-red-200 bg-red-50/50 dark:bg-red-900/10"} transition-all duration-200`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            {result.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="text-sm font-medium">
                              Test Case {index + 1}: {result.passed ? "✅ Passed" : "❌ Failed"}
                            </span>
                            <Badge variant="outline" className="text-xs bg-white/80 dark:bg-gray-800/80">
                              {result.executionTime}ms
                            </Badge>
                            {!result.isVisible && (
                              <Badge variant="secondary" className="text-xs">
                                🔒 Hidden
                              </Badge>
                            )}
                          </div>

                          {/* ... existing test result display code ... */}
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div>
                              <div className="font-medium text-muted-foreground">Input:</div>
                              <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {result.isVisible || !result.passed ? result.input : "Hidden"}
                              </pre>
                            </div>
                            <div>
                              <div className="font-medium text-muted-foreground">Expected:</div>
                              <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {result.isVisible || !result.passed ? result.expectedOutput : "Hidden"}
                              </pre>
                            </div>
                            <div>
                              <div className="font-medium text-muted-foreground">Your Output:</div>
                              <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">{result.actualOutput}</pre>
                            </div>
                            {!result.isVisible && result.passed && (
                              <div className="text-xs text-green-600 font-medium mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                ✓ Hidden test case passed - Your output matches the expected result
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {submitResults.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        📊 Submission Summary: {submitResults.filter((r) => r.passed).length} / {submitResults.length}{" "}
                        test cases passed
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Score earned:{" "}
                        {Math.round(
                          (submitResults.filter((r) => r.passed).length / submitResults.length) *
                            currentQuestion.points,
                        )}{" "}
                        points
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="lg:w-1/2 w-full flex flex-col min-h-0 flex-1">
          <div className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Code Editor</span>
                  <p className="text-xs text-muted-foreground">Write your solution here</p>
                </div>
              </div>
              <Select value={language} onValueChange={(value: "java" | "cpp") => setLanguage(value)}>
                <SelectTrigger className="w-32 bg-white dark:bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">☕ Java</SelectItem>
                  <SelectItem value="cpp">⚡ C++</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleFinishTest}
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finish Test
                </Button>
              ) : (
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip
                </Button>
              )}
              {submitResults.length > 0 && currentQuestionIndex < questions.length - 1 && (
                <Button
                  onClick={() => {
                    setSubmitResults([])
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Next Question
                </Button>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 min-h-0 relative bg-background">
            <div className="absolute inset-0 p-1">
              <div className="h-full w-full border rounded-lg overflow-hidden shadow-sm">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  theme={theme}
                  onRunCode={handleRunCode}
                  onSave={() => {
                    localStorage.setItem(`code_${currentQuestion.id}_${language}`, code)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="bg-white dark:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">
                {currentQuestionIndex + 1} of {questions.length}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-white dark:bg-gray-800"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
