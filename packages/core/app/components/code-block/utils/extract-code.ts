import React from "react"

export function extractCodeFromChildren(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (React.isValidElement(child) && child.props.code) {
        return child.props.code
      }
      return ""
    })
    .join("")
}
