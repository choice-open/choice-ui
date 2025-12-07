import React from "react"

export function extractCodeFromChildren(children: React.ReactNode): string {
  if (!children) return ""

  try {
    return React.Children.toArray(children)
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
      .filter(Boolean)
      .join("")
  } catch {
    return ""
  }
}
