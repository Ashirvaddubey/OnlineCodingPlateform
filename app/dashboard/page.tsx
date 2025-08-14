"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LogOut, Moon, Sun, Play, CheckCircle, Clock, Trophy } from "lucide-react"
import { useTheme } from "next-themes"

interface User {
  id: string
  email: string
  name: string
}

interface TestProgress {
  completedQuestions: number
  totalQuestions: number
  score: number
  timeRemaining: number
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<TestProgress>({
    completedQuestions: 0,
    totalQuestions: 15,
    score: 0,
    timeRemaining: 7200, // 2 hours in seconds
  })
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/"
      return
    }

    // Verify token and get user data
    fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          // Load user progress
          loadProgress()
        } else {
          localStorage.removeItem("token")
          window.location.href = "/"
        }
      })
      .catch(() => {
        localStorage.removeItem("token")
        window.location.href = "/"
      })
      .finally(() => setIsLoading(false))
  }, [])

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
        setProgress(data.progress)
      }
    } catch (error) {
      console.error("Failed to load progress:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const startTest = () => {
    window.location.href = "/test"
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CodeTest Platform</h1>
              <p className="text-sm text-muted-foreground">DSA Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Candidate</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Progress</CardTitle>
                <CardDescription>Track your completion status and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Questions Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {progress.completedQuestions} / {progress.totalQuestions}
                  </span>
                </div>
                <Progress value={(progress.completedQuestions / progress.totalQuestions) * 100} className="h-2" />

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{progress.score}</div>
                    <div className="text-sm text-muted-foreground">Current Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((progress.completedQuestions / progress.totalQuestions) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start/Continue Test */}
            <Card>
              <CardHeader>
                <CardTitle>{progress.completedQuestions === 0 ? "Start Your Test" : "Continue Test"}</CardTitle>
                <CardDescription>
                  {progress.completedQuestions === 0
                    ? "Begin your DSA coding assessment with 15 challenging problems"
                    : `Resume from question ${progress.completedQuestions + 1}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={startTest} className="w-full" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  {progress.completedQuestions === 0 ? "Start Test" : "Continue Test"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Remaining */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{formatTime(progress.timeRemaining)}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total test duration: 2 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Test Info */}
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Questions</span>
                  <Badge variant="secondary">15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Languages</span>
                  <div className="flex gap-1">
                    <Badge variant="outline">Java</Badge>
                    <Badge variant="outline">C++</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Test Cases</span>
                  <Badge variant="secondary">6 per question</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visible Cases</span>
                  <Badge variant="secondary">2 per question</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Choose Java or C++ for each question</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Run code against 2 visible test cases</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Submit to test against all 6 cases</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Skip questions if needed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
