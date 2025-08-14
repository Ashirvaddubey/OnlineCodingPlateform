"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Code, Trophy, Users } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0)

  const demoAccounts = [
    { email: "demo1@example.com", password: "demo123", name: "Demo User 1" },
    { email: "demo2@example.com", password: "demo123", name: "Demo User 2" },
    { email: "demo3@example.com", password: "demo123", name: "Demo User 3" },
    { email: "demo4@example.com", password: "demo123", name: "Demo User 4" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", { email, password: "***" })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed with response:", errorText)

        try {
          const errorData = JSON.parse(errorText)
          setError(errorData.message || "Login failed")
        } catch {
          setError(`Login failed (${response.status}): ${errorText}`)
        }
        return
      }

      const data = await response.json()
      console.log("Login successful:", { user: data.user })

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        window.location.href = "/dashboard"
      } else {
        setError("No authentication token received")
      }
    } catch (err) {
      console.error("Network error:", err)
      setError(`Network error: ${err instanceof Error ? err.message : "Please check your connection and try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  const selectDemoAccount = (index: number) => {
    const demo = demoAccounts[index]
    setEmail(demo.email)
    setPassword(demo.password)
    setCurrentDemoIndex(index)
    setError("") // Clear any previous errors
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Code className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CodeTest Platform</h1>
          <p className="text-gray-600 dark:text-gray-300">Full-Stack Coding Assessment System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the coding test platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Users className="h-5 w-5" />
              Demo Accounts
            </CardTitle>
            <CardDescription>Try the platform with these demo credentials (Public Access)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((demo, index) => (
                <Button
                  key={index}
                  variant={currentDemoIndex === index ? "default" : "outline"}
                  className="justify-start text-left h-auto p-3"
                  onClick={() => selectDemoAccount(index)}
                >
                  <div>
                    <div className="font-medium">{demo.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {demo.email} / {demo.password}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              All demo accounts share the same password: <code className="bg-muted px-1 rounded">demo123</code>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full w-fit mx-auto">
              <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Java & C++</p>
          </div>
          <div className="space-y-2">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full w-fit mx-auto">
              <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Auto-Grading</p>
          </div>
          <div className="space-y-2">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full w-fit mx-auto">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">15 Questions</p>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Ready for deployment to Vercel</p>
          <p>Database: MongoDB (localhost:27017/MeritshotData/Users)</p>
        </div>
      </div>
    </div>
  )
}
