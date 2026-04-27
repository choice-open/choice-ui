import React from "react"

export function extractCodeFromChildren(children: React.ReactNode): string {
  if (!children) return ""

  try {
    return React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string") {
          return child
        }
        if (React.isValidElement(child)) {
          if (child.props?.code && typeof child.props.code === "string") {
            return child.props.code
          }
          if (child.props?.children) {
            if (typeof child.props.children === "string") {
              return child.props.children
            }
            return extractCodeFromChildren(child.props.children)
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
