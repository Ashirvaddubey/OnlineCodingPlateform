"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import * as monaco from "monaco-editor"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { WrapText, RotateCcw, Clipboard, Trash2 } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: "java" | "cpp"
  theme?: string
  onRunCode?: () => void
  onSave?: () => void
}

export function CodeEditor({ value, onChange, language, theme, onRunCode, onSave }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const isDisposingRef = useRef(false)
  const lastValueRef = useRef(value)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [editorStatus, setEditorStatus] = useState<"loading" | "ready" | "error">("loading")

  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState<"on" | "off">("on")

  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("ResizeObserver loop completed with undelivered notifications") ||
          args[0].includes("Canceled: Canceled"))
      ) {
        return
      }
      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  const getDefaultTemplate = useCallback((lang: "java" | "cpp") => {
    if (lang === "java") {
      return `// Language: Java
// Implement your solution below

public class Solution {
    public static void main(String[] args) {
        // Your code here
        
    }
}`
    } else {
      return `// Language: C++
// Implement your solution below

#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`
    }
  }, [])

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        onChange(text)
        setTimeout(() => {
          if (monacoRef.current && !isDisposingRef.current) {
            monacoRef.current.focus()
            const model = monacoRef.current.getModel()
            if (model) {
              const lineCount = model.getLineCount()
              const lastLineLength = model.getLineLength(lineCount)
              monacoRef.current.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 })
            }
          }
        }, 100)
      }
    } catch (error) {
      console.warn("Could not paste from clipboard:", error)
      if (monacoRef.current && !isDisposingRef.current) {
        monacoRef.current.focus()
      }
    }
  }, [onChange])

  const clearAll = useCallback(() => {
    onChange("")
    setTimeout(() => {
      if (monacoRef.current && !isDisposingRef.current) {
        monacoRef.current.focus()
      }
    }, 100)
  }, [onChange])

  const positionCursorInMain = useCallback(() => {
    if (monacoRef.current && !isDisposingRef.current && isEditorReady) {
      try {
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
      } catch (error) {
        console.warn("Could not position cursor:", error)
      }
    }
  }, [isEditorReady])

  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      setEditorStatus("loading")

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
          automaticLayout: false,
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

        monacoRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          if (onRunCode) {
            onRunCode()
          }
        })

        monacoRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          if (onSave) {
            onSave()
          }
        })

        monacoRef.current.onDidChangeModelContent(() => {
          if (monacoRef.current && !isDisposingRef.current) {
            const newValue = monacoRef.current.getValue()
            if (lastValueRef.current !== newValue) {
              lastValueRef.current = newValue
              onChange(newValue)
            }
          }
        })

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

        setIsEditorReady(true)
        setEditorStatus("ready")

        setTimeout(() => {
          if (monacoRef.current && !isDisposingRef.current) {
            monacoRef.current.layout()
            monacoRef.current.focus()
            positionCursorInMain()
          }
        }, 100)

        return () => {
          window.removeEventListener("resize", handleResize)
        }
      } catch (error) {
        console.error("Failed to create Monaco Editor:", error)
        setEditorStatus("error")
      }
    }

    return () => {
      isDisposingRef.current = true
      setIsEditorReady(false)
      setEditorStatus("loading")
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

  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current && isEditorReady) {
      try {
        monacoRef.current.updateOptions({ fontSize })
        monacoRef.current.layout()
      } catch (error) {
        console.warn("Could not update font size:", error)
      }
    }
  }, [fontSize, isEditorReady])

  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current && isEditorReady) {
      try {
        monacoRef.current.updateOptions({ wordWrap })
        monacoRef.current.layout()
      } catch (error) {
        console.warn("Could not update word wrap:", error)
      }
    }
  }, [wordWrap, isEditorReady])

  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current && isEditorReady) {
      const model = monacoRef.current.getModel()
      if (model) {
        try {
          monaco.editor.setModelLanguage(model, language === "cpp" ? "cpp" : "java")
        } catch (error) {
          console.warn("Could not update language:", error)
        }
      }
    }
  }, [language, isEditorReady])

  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current && isEditorReady) {
      try {
        monaco.editor.setTheme(theme === "dark" ? "custom-dark" : "custom-light")
      } catch (error) {
        console.warn("Could not update theme:", error)
      }
    }
  }, [theme, isEditorReady])

  useEffect(() => {
    if (monacoRef.current && !isDisposingRef.current && isEditorReady && lastValueRef.current !== value) {
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
  }, [value, isEditorReady])

  const resetToTemplate = useCallback(() => {
    const template = getDefaultTemplate(language)
    onChange(template)
    setTimeout(() => {
      positionCursorInMain()
    }, 100)
  }, [language, onChange, getDefaultTemplate, positionCursorInMain])

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
          >
            {language.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
            Line Numbers: On
          </Badge>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                editorStatus === "ready"
                  ? "bg-green-500"
                  : editorStatus === "loading"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {editorStatus === "ready" ? "Ready" : editorStatus === "loading" ? "Loading..." : "Error"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number.parseInt(value))}>
            <SelectTrigger className="w-20 h-8 text-xs bg-white dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
              <SelectItem value="20">20px</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWordWrap(wordWrap === "on" ? "off" : "on")}
            className="h-8 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title={`Word wrap: ${wordWrap}`}
          >
            <WrapText className={`h-3 w-3 ${wordWrap === "on" ? "text-blue-600" : "text-gray-400"}`} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={pasteFromClipboard}
            className="h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/20"
            title="Paste code from clipboard"
          >
            <Clipboard className="h-3 w-3 text-green-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 px-2 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear all code"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetToTemplate}
            className="h-8 px-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            title="Reset to template"
          >
            <RotateCcw className="h-3 w-3 text-orange-600" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {editorStatus === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading editor...</p>
            </div>
          </div>
        )}

        {editorStatus === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-sm text-red-600">Failed to load editor</p>
            </div>
          </div>
        )}

        <div
          ref={editorRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
          }}
        />

        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Enter</kbd>
              <span>Run Code</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl+S</kbd>
              <span>Save</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl+V</kbd>
              <span>Paste</span>
            </div>
            <div className="flex items-center gap-2">
              <Clipboard className="h-3 w-3 text-green-600" />
              <span>Paste Button</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 className="h-3 w-3 text-red-600" />
              <span>Clear All Button</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
