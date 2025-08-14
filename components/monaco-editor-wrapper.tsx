"use client"

import { useEffect, useRef, useCallback } from "react"
import * as monaco from "monaco-editor"

interface MonacoEditorWrapperProps {
  value: string
  onChange: (value: string) => void
  language: "java" | "cpp"
  theme?: string
  fontSize: number
  wordWrap: "on" | "off"
}

export default function MonacoEditorWrapper({
  value,
  onChange,
  language,
  theme,
  fontSize,
  wordWrap,
}: MonacoEditorWrapperProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const isDisposingRef = useRef(false)
  const lastValueRef = useRef(value)

  // Define custom themes
  useEffect(() => {
    if (typeof window !== "undefined") {
      monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
        ],
        colors: {
          "editor.background": "#1e1e1e",
          "editor.foreground": "#d4d4d4",
          "editorCursor.foreground": "#aeafad",
        },
      })

      monaco.editor.defineTheme("custom-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "008000", fontStyle: "italic" },
          { token: "keyword", foreground: "0000ff", fontStyle: "bold" },
          { token: "string", foreground: "a31515" },
          { token: "number", foreground: "098658" },
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editorCursor.foreground": "#000000",
        },
      })
    }
  }, [])

  // Initialize Monaco Editor
  useEffect(() => {
    if (editorRef.current && !monacoRef.current && typeof window !== "undefined") {
      try {
        monacoRef.current = monaco.editor.create(editorRef.current, {
          value,
          language: language === "cpp" ? "cpp" : "java",
          theme: theme === "dark" ? "custom-dark" : "custom-light",
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          minimap: { enabled: false },
          wordWrap,
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
          contextmenu: true,
          selectOnLineNumbers: true,
          mouseWheelZoom: false,
          cursorBlinking: "blink",
          cursorWidth: 2,
          smoothScrolling: true,
          readOnly: false,
          domReadOnly: false,
          quickSuggestions: true,
          acceptSuggestionOnEnter: "on",
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,
          dragAndDrop: true,
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 14,
            horizontalScrollbarSize: 14,
          },
        })

        // Handle content changes
        monacoRef.current.onDidChangeModelContent(() => {
          if (monacoRef.current && !isDisposingRef.current) {
            const newValue = monacoRef.current.getValue()
            if (lastValueRef.current !== newValue) {
              lastValueRef.current = newValue
              onChange(newValue)
            }
          }
        })

        // Handle resize
        const handleResize = () => {
          if (monacoRef.current && !isDisposingRef.current) {
            try {
              monacoRef.current.layout()
            } catch (error) {
              // Ignore layout errors
            }
          }
        }

        window.addEventListener("resize", handleResize)

        // Focus and position cursor
        setTimeout(() => {
          if (monacoRef.current && !isDisposingRef.current) {
            monacoRef.current.layout()
            monacoRef.current.focus()
            
            // Position cursor at "// Your code here" if it exists
            const model = monacoRef.current.getModel()
            if (model) {
              const content = model.getValue()
              const codeHereIndex = content.indexOf("// Your code here")
              if (codeHereIndex !== -1) {
                const lines = content.substring(0, codeHereIndex).split("\n")
                const lineNumber = lines.length
                const position = { lineNumber: lineNumber + 1, column: 9 }
                monacoRef.current.setPosition(position)
              }
            }
          }
        }, 100)

        return () => {
          window.removeEventListener("resize", handleResize)
        }
      } catch (error) {
        console.error("Failed to create Monaco Editor:", error)
      }
    }

    return () => {
      isDisposingRef.current = true
      if (monacoRef.current) {
        try {
          monacoRef.current.dispose()
        } catch (error) {
          // Ignore disposal errors
        }
        monacoRef.current = null
      }
    }
  }, []) // Empty dependency array - only run once

  // Update font size
  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current) {
      try {
        monacoRef.current.updateOptions({ fontSize })
        monacoRef.current.layout()
      } catch (error) {
        console.warn("Could not update font size:", error)
      }
    }
  }, [fontSize])

  // Update word wrap
  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current) {
      try {
        monacoRef.current.updateOptions({ wordWrap })
        monacoRef.current.layout()
      } catch (error) {
        console.warn("Could not update word wrap:", error)
      }
    }
  }, [wordWrap])

  // Update language
  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current) {
      const model = monacoRef.current.getModel()
      if (model) {
        try {
          monaco.editor.setModelLanguage(model, language === "cpp" ? "cpp" : "java")
        } catch (error) {
          console.warn("Could not update language:", error)
        }
      }
    }
  }, [language])

  // Update theme
  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current) {
      try {
        monaco.editor.setTheme(theme === "dark" ? "custom-dark" : "custom-light")
      } catch (error) {
        console.warn("Could not update theme:", error)
      }
    }
  }, [theme])

  // Update value
  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current && lastValueRef.current !== value) {
      try {
        const position = monacoRef.current.getPosition()
        monacoRef.current.setValue(value)
        lastValueRef.current = value

        setTimeout(() => {
          if (monacoRef.current && !isDisposingRef.current && position) {
            try {
              monacoRef.current.setPosition(position)
              monacoRef.current.focus()
            } catch (error) {
              console.warn("Could not restore cursor position:", error)
            }
          }
        }, 50)
      } catch (error) {
        console.warn("Could not update value:", error)
      }
    }
  }, [value])

  return (
    <div className="w-full h-96 border rounded-md overflow-hidden">
      <div
        ref={editorRef}
        className="w-full h-full"
        style={{
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
        }}
      />
    </div>
  )
}
