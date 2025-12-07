import { useState, useEffect } from "react"
import React from "react"

export function useLineCount(children: React.ReactNode) {
  const [lineCount, setLineCount] = useState(0)

  useEffect(() => {
    try {
      const codeContent = React.Children.toArray(children)
        .map((child) => {
          if (
            React.isValidElement(child) &&
            child.props?.code &&
            typeof child.props.code === "string"
          ) {
            return child.props.code
          }
          return ""
        })
        .join("")

      if (codeContent) {
        const lines = codeContent.split("\n").length
        setLineCount(lines)
      } else {
        setLineCount(0)
      }
    } catch (error) {
      setLineCount(0)
    }
  }, [children])

  return lineCount
}
