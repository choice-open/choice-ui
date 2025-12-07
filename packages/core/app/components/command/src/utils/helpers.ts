import React from "react"

export const useLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export function renderChildren(children: React.ReactElement): React.ReactNode {
  const childrenType = children.type

  // The children is a function component or class component
  if (typeof childrenType === "function") {
    // Try to call as function component first
    try {
      return (childrenType as React.FunctionComponent)(children.props)
    } catch {
      // If it fails, it might be a class component, return the original element
      return children
    }
  }

  // The children is a component with `forwardRef`
  if (typeof childrenType === "object" && childrenType !== null && "render" in childrenType) {
    const forwardRefComponent = childrenType as {
      render: (props: unknown, ref: unknown) => React.ReactNode
    }
    return forwardRefComponent.render(children.props, null)
  }

  // It's a string, boolean, etc.
  return children
}

export function SlottableWithNestedChildren(
  { asChild, children }: { asChild?: boolean; children?: React.ReactNode },
  render: (child: React.ReactNode) => JSX.Element,
) {
  if (asChild && React.isValidElement(children)) {
    const renderedChild = renderChildren(children)
    if (React.isValidElement(renderedChild)) {
      const childProps = children.props
      // Use a safer approach that avoids ref type issues
      return React.cloneElement(renderedChild, {}, render(childProps.children))
    }
  }
  return render(children)
}
