import React from "react"

export function extractCodeFromChildren(children: React.ReactNode): string {
  if (!children) return ""

  try {
    return React.Children.toArray(children)
      .map((child) => {
        if (React.isValidElement(child)) {
          // Check for code prop first
          if (child.props?.code && typeof child.props.code === "string") {
            return child.props.code
          }
          // Then check for children prop (CodeBlock.Content passes code as children)
          if (child.props?.children && typeof child.props.children === "string") {
            return child.props.children
          }
        }
        return ""
      })
      .filter(Boolean)
      .join("")
  } catch {
    return ""
  }
}
