import { getAllTestCases } from "./questions"
import type { TestResult } from "./database"

export interface ExecutionResult {
  success: boolean
  results: TestResult[]
  error?: string
  compilationError?: string
}

// Mock code execution service - in production, use Judge0 API or Docker containers
export class CodeExecutor {
  private static instance: CodeExecutor
  private executionTimeout = 5000 // 5 seconds

  static getInstance(): CodeExecutor {
    if (!CodeExecutor.instance) {
      CodeExecutor.instance = new CodeExecutor()
    }
    return CodeExecutor.instance
  }

  async executeCode(
    code: string,
    language: "java" | "cpp",
    questionId: number,
    includeHidden = false,
  ): Promise<ExecutionResult> {
    try {
      // Get test cases
      const testCases = getAllTestCases(questionId)
      const casesToRun = includeHidden ? testCases : testCases.filter((tc) => tc.isVisible)

      if (casesToRun.length === 0) {
        return {
          success: false,
          results: [],
          error: "No test cases found",
        }
      }

      // Validate code
      const validationError = this.validateCode(code, language)
      if (validationError) {
        return {
          success: false,
          results: [],
          compilationError: validationError,
        }
      }

      // Execute code against test cases
      const results: TestResult[] = []

      for (let i = 0; i < casesToRun.length; i++) {
        const testCase = casesToRun[i]
        const result = await this.runSingleTest(code, language, testCase.input, testCase.expectedOutput, i)
        results.push({
          ...result,
          isVisible: testCase.isVisible,
        })
      }

      return {
        success: true,
        results,
      }
    } catch (error) {
      console.error("Code execution error:", error)
      return {
        success: false,
        results: [],
        error: "Execution failed: " + (error as Error).message,
      }
    }
  }

  private validateCode(code: string, language: "java" | "cpp"): string | null {
    if (!code.trim()) {
      return "Code cannot be empty"
    }

    if (language === "java") {
      // Basic Java validation
      if (!code.includes("public class") && !code.includes("class")) {
        return "Java code must contain a class definition"
      }
      if (!code.includes("public static void main")) {
        return "Java code must contain a main method"
      }
      // Check for potentially dangerous operations
      if (code.includes("System.exit") || code.includes("Runtime.getRuntime")) {
        return "System operations are not allowed"
      }
    } else if (language === "cpp") {
      // Basic C++ validation
      if (!code.includes("#include")) {
        return "C++ code must include necessary headers"
      }
      if (!code.includes("int main")) {
        return "C++ code must contain a main function"
      }
      // Check for potentially dangerous operations
      if (code.includes("system(") || code.includes("exec")) {
        return "System operations are not allowed"
      }
    }

    return null
  }

  private async runSingleTest(
    code: string,
    language: "java" | "cpp",
    input: string,
    expectedOutput: string,
    testIndex: number,
  ): Promise<Omit<TestResult, "isVisible">> {
    const startTime = Date.now()

    try {
      // Simulate code execution - in production, use Judge0 API or Docker
      const output = await this.simulateExecution(code, language, input)
      const executionTime = Date.now() - startTime

      const passed = this.compareOutputs(output.trim(), expectedOutput.trim())

      return {
        testCaseIndex: testIndex,
        passed,
        input,
        expectedOutput,
        actualOutput: output,
        executionTime,
      }
    } catch (error) {
      return {
        testCaseIndex: testIndex,
        passed: false,
        input,
        expectedOutput,
        actualOutput: `Runtime Error: ${(error as Error).message}`,
        executionTime: Date.now() - startTime,
      }
    }
  }

  private async simulateExecution(code: string, language: "java" | "cpp", input: string): Promise<string> {
    // This is a mock implementation - in production, you would:
    // 1. Use Judge0 API for secure code execution
    // 2. Or use Docker containers with proper sandboxing
    // 3. Handle compilation and execution separately

    // For demo purposes, we'll simulate some basic logic
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          try {
            // Mock execution logic based on common patterns
            const output = this.mockExecutionLogic(code, input)
            resolve(output)
          } catch (error) {
            reject(error)
          }
        },
        Math.random() * 1000 + 500,
      ) // Simulate execution time
    })
  }

  private mockExecutionLogic(code: string, input: string): string {
    const lines = input.split("\n")
    const codeLines = code.toLowerCase()

    // Handle simple print statements
    if (codeLines.includes("system.out.println") || codeLines.includes("cout")) {
      // Extract print statements and simulate output
      const printMatches =
        code.match(/System\.out\.println\s*$$\s*"([^"]+)"\s*$$/gi) || code.match(/cout\s*<<\s*"([^"]+)"/gi)

      if (printMatches) {
        return printMatches
          .map((match) => {
            // Extract the string content
            const stringMatch = match.match(/"([^"]+)"/)
            return stringMatch ? stringMatch[1] : "Hello World"
          })
          .join("\n")
      }

      // If no specific string found, check for common patterns
      if (codeLines.includes("hello")) return "Hello World"
      if (codeLines.includes("world")) return "Hello World"
    }

    // Handle input/output operations
    if (codeLines.includes("scanner") || codeLines.includes("cin")) {
      // If code reads input, use the provided input
      if (input.trim()) {
        const inputLines = input.trim().split("\n")
        // Simple echo for demonstration
        return inputLines.join(" ")
      }
    }

    // Mock some basic patterns for demonstration
    if (code.includes("Maximum sales") || code.includes("max")) {
      // Sales Report Analysis mock
      const n = Number.parseInt(lines[0])
      const sales = lines[1].split(" ").map(Number)
      const max = Math.max(...sales)
      const min = Math.min(...sales)
      const avg = Math.floor(sales.reduce((a, b) => a + b, 0) / sales.length)
      const maxDay = sales.indexOf(max) + 1
      const minDay = sales.indexOf(min) + 1
      return `Maximum sales: ${max} on day ${maxDay}\nMinimum sales: ${min} on day ${minDay}\nAverage sales: ${avg}`
    }

    if (code.includes("sort") || code.includes("selection")) {
      // Student Ranking mock
      const n = Number.parseInt(lines[0])
      const marks = lines[1].split(" ").map(Number)
      marks.sort((a, b) => b - a) // Descending order
      return marks.join(" ")
    }

    if (code.includes("rotate") || code.includes("array")) {
      // Array rotation mock
      const [n, k] = lines[0].split(" ").map(Number)
      const arr = lines[1].split(" ").map(Number)
      const rotated = [...arr.slice(k), ...arr.slice(0, k)]
      return rotated.join(" ")
    }

    if (codeLines.includes("sum") || codeLines.includes("+")) {
      if (input.trim()) {
        const numbers = input
          .trim()
          .split(/\s+/)
          .map(Number)
          .filter((n) => !isNaN(n))
        if (numbers.length > 0) {
          return numbers.reduce((a, b) => a + b, 0).toString()
        }
      }
    }

    if (codeLines.includes("for") || codeLines.includes("while")) {
      if (input.trim()) {
        const n = Number.parseInt(input.trim().split(/\s+/)[0])
        if (!isNaN(n) && n > 0 && n <= 100) {
          return Array.from({ length: n }, (_, i) => i + 1).join(" ")
        }
      }
    }

    const stringLiterals = code.match(/"([^"]+)"/g)
    if (stringLiterals && stringLiterals.length > 0) {
      return stringLiterals.map((s) => s.replace(/"/g, "")).join("\n")
    }

    if (input.trim()) {
      return `Processed: ${input.trim()}`
    }

    // Final fallback
    return "Program executed successfully"
  }

  private compareOutputs(actual: string, expected: string): boolean {
    // Normalize whitespace and compare
    const normalizeOutput = (str: string) => str.replace(/\s+/g, " ").trim().toLowerCase()

    return normalizeOutput(actual) === normalizeOutput(expected)
  }
}

// Judge0 API integration (for production use)
export class Judge0Executor {
  private apiUrl = "https://judge0-ce.p.rapidapi.com"
  private apiKey = process.env.JUDGE0_API_KEY || ""

  async submitCode(code: string, language: "java" | "cpp", input: string): Promise<any> {
    const languageId = language === "java" ? 62 : 54 // Java: 62, C++: 54

    const response = await fetch(`${this.apiUrl}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.apiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: null,
      }),
    })

    return response.json()
  }

  async getSubmission(token: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/submissions/${token}`, {
      headers: {
        "X-RapidAPI-Key": this.apiKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    })

    return response.json()
  }
}
