import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-demo-only-change-in-production"

export interface User {
  id: string
  email: string
  name: string
  password?: string
}

// Demo users for testing
export const DEMO_USERS: User[] = [
  {
    id: "demo1",
    email: "demo1@example.com",
    name: "Demo User 1",
    password: "demo123", // In production, this would be hashed
  },
  {
    id: "demo2",
    email: "demo2@example.com",
    name: "Demo User 2",
    password: "demo123", // In production, this would be hashed
  },
  {
    id: "demo3",
    email: "demo3@example.com",
    name: "Demo User 3",
    password: "demo123", // In production, this would be hashed
  },
  {
    id: "demo4",
    email: "demo4@example.com",
    name: "Demo User 4",
    password: "demo123", // In production, this would be hashed
  },
]

export function generateToken(user: User): string {
  try {
    // Create a simple token using base64 encoding
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    }

    const tokenData = JSON.stringify(payload)
    const token = btoa(tokenData) // Base64 encode
    return token
  } catch (error) {
    console.error("Token generation error:", error)
    throw new Error("Failed to generate authentication token")
  }
}

export function verifyToken(token: string): User | null {
  try {
    const tokenData = atob(token) // Base64 decode
    const payload = JSON.parse(tokenData)

    // Check if token is expired
    if (Date.now() > payload.exp) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function findUserByEmail(email: string): User | null {
  return DEMO_USERS.find((user) => user.email === email) || null
}

export function validateDemoCredentials(email: string, password: string): { user: User | null; error?: string } {
  try {
    const user = findUserByEmail(email)

    if (!user) {
      return { user: null, error: "Invalid email address" }
    }

    if (password !== "demo123") {
      return { user: null, error: "Invalid password" }
    }

    return { user }
  } catch (error) {
    console.error("Demo credential validation error:", error)
    return { user: null, error: "Authentication system error" }
  }
}

export function initializeDemoUserProgress(userId: string): void {
  // This would typically be done in the database
  // For now, we'll handle it in the database module
}
