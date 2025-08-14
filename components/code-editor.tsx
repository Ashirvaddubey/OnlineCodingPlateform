"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { WrapText, RotateCcw, Clipboard, Trash2 } from "lucide-react"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("./monaco-editor-wrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-muted animate-pulse rounded-md flex items-center justify-center">
      <div className="text-muted-foreground">Loading code editor...</div>
    </div>
  ),
})

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: "java" | "cpp"
  theme?: string
  onRunCode?: () => void
  onSave?: () => void
}

export function CodeEditor({ value, onChange, language, theme, onRunCode, onSave }: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState<"on" | "off">("on")

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
      }
    } catch (error) {
      console.warn("Could not paste from clipboard:", error)
    }
  }, [onChange])

  const clearAll = useCallback(() => {
    onChange("")
  }, [onChange])

  const resetToTemplate = useCallback(() => {
    onChange(getDefaultTemplate(language))
  }, [language, onChange, getDefaultTemplate])

  const toggleWordWrap = useCallback(() => {
    setWordWrap(prev => prev === "on" ? "off" : "on")
  }, [])

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }, [])

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => Math.max(prev - 2, 10))
  }, [])

  return (
    <div className="w-full space-y-4">
      {/* Editor Controls */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {fontSize}px
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseFontSize}
            disabled={fontSize <= 10}
            className="h-8 w-8 p-0"
          >
            A-
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseFontSize}
            disabled={fontSize >= 24}
            className="h-8 w-8 p-0"
          >
            A+
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleWordWrap}
          className="h-8 px-2"
        >
          <WrapText className="h-4 w-4 mr-1" />
          {wordWrap === "on" ? "Wrap" : "No Wrap"}
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToTemplate}
            className="h-8 px-2"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={pasteFromClipboard}
            className="h-8 px-2"
          >
            <Clipboard className="h-4 w-4 mr-1" />
            Paste
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 px-2"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {onRunCode && (
          <Button
            onClick={onRunCode}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white"
          >
            Run Code
          </Button>
        )}

        {onSave && (
          <Button
            onClick={onSave}
            variant="outline"
            className="ml-2"
          >
            Save
          </Button>
        )}
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        value={value}
        onChange={onChange}
        language={language}
        theme={theme}
        fontSize={fontSize}
        wordWrap={wordWrap}
      />
    </div>
  )
}
