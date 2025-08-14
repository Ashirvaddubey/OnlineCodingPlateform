import { type NextRequest, NextResponse } from "next/server"
import { generateToken, validateDemoCredentials } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    let email: string, password: string

    try {
      const body = await request.json()
      email = body.email
      password = body.password
    } catch (parseError) {
      console.error("Request parsing error:", parseError)
      return NextResponse.json({ message: "Invalid request format" }, { status: 400 })
    }

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const { user, error } = validateDemoCredentials(email, password)

    if (!user || error) {
      return NextResponse.json({ message: error || "Invalid credentials" }, { status: 401 })
    }

    let token: string
    try {
      token = generateToken(user)
    } catch (tokenError) {
      console.error("Token generation failed:", tokenError)
      return NextResponse.json({ message: "Authentication system error" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
