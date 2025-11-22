import { useState, useEffect } from "react"
import React from "react"

export function useLineCount(children: React.ReactNode) {
  const [lineCount, setLineCount] = useState(0)

  useEffect(() => {
    const codeContent = React.Children.toArray(children)
      .map((child) => {
        if (React.isValidElement(child) && child.props.code) {
          return child.props.code
        }
        return ""
      })
      .join("")

    if (codeContent) {
      const lines = codeContent.split("\n").length
      setLineCount(lines)
    }
  }, [children])

  return lineCount
}
