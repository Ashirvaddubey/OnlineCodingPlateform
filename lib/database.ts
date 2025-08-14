// Mock database for storing user submissions and progress
// In production, this would connect to MongoDB at localhost:27017/MeritshotData/Users

export interface UserSubmission {
  id: string
  userId: string
  questionId: number
  code: string
  language: "java" | "cpp"
  status: "pending" | "running" | "completed" | "error"
  score: number
  testResults: TestResult[]
  submittedAt: Date
}

export interface TestResult {
  testCaseIndex: number
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  executionTime: number
  isVisible: boolean
}

export interface UserProgress {
  userId: string
  completedQuestions: number[]
  totalScore: number
  timeRemaining: number
  lastActivity: Date
}

// Mock in-memory storage (replace with MongoDB in production)
const submissions: UserSubmission[] = []
const userProgress: Map<string, UserProgress> = new Map()

export function saveSubmission(submission: UserSubmission): void {
  submissions.push(submission)
}

export function getSubmissionsByUser(userId: string): UserSubmission[] {
  return submissions.filter((s) => s.userId === userId)
}

export function getSubmissionById(id: string): UserSubmission | null {
  return submissions.find((s) => s.id === id) || null
}

export function getUserProgress(userId: string): UserProgress {
  if (!userProgress.has(userId)) {
    userProgress.set(userId, {
      userId,
      completedQuestions: [],
      totalScore: 0,
      timeRemaining: 7200, // 2 hours in seconds
      lastActivity: new Date(),
    })
  }
  return userProgress.get(userId)!
}

export function updateUserProgress(userId: string, progress: Partial<UserProgress>): void {
  const current = getUserProgress(userId)
  userProgress.set(userId, {
    ...current,
    ...progress,
    lastActivity: new Date(),
  })
}

export function getLeaderboard(): Array<{ userId: string; totalScore: number; completedQuestions: number }> {
  return Array.from(userProgress.values())
    .map((p) => ({
      userId: p.userId,
      totalScore: p.totalScore,
      completedQuestions: p.completedQuestions.length,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)
}
