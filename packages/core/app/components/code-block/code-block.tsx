import { tcx } from "@choiceform/design-system"
import React, { memo } from "react"
import { useStickToBottom } from "use-stick-to-bottom"
import { useCodeBlock, useLineCount, useScrollDetection, useTheme } from "./hooks"
import type { CodeBlockContextValue, CodeBlockProps } from "./types"

export const CodeBlock = memo(function CodeBlock(props: CodeBlockProps) {
  const {
    children,
    className,
    filename,
    language = "code",
    lineThreshold = 20,
    expandable = true,
    defaultExpanded = true,
    defaultCodeExpanded = false,
    onExpandChange,
    onCodeExpandChange,
  } = props

  const theme = useTheme()

  const { scrollRef, contentRef, scrollToBottom } = useStickToBottom({
    resize: "smooth",
    initial: "smooth",
  })

  // Store the code content in a ref so it can be accessed by the copy handler
  const codeContentRef = React.useRef<string>("")

  const {
    isExpanded,
    codeExpanded,
    copied,
    handleExpand,
    handleCodeExpand,
    handleCopy: originalHandleCopy,
  } = useCodeBlock({
    defaultExpanded,
    defaultCodeExpanded,
    onExpandChange,
    onCodeExpandChange,
    scrollToBottom,
  })

  // Wrap the copy handler to use the stored code content
  const handleCopy = React.useCallback(
    (code?: string) => {
      const codeToUse = code || codeContentRef.current
      if (codeToUse) {
        originalHandleCopy(codeToUse)
      }
    },
    [originalHandleCopy],
  )

  // Update code content ref when children change
  React.useEffect(() => {
    // Find BlockCode component in children to extract code
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // Check if it's BlockCode component by looking for code prop
        if (child.props?.code && typeof child.props.code === "string") {
          codeContentRef.current = child.props.code
        }
      }
    })
  }, [children])

  const lineCount = useLineCount(children)
  const needsScroll = useScrollDetection({
    scrollRef,
    contentRef,
    isExpanded,
    codeExpanded,
    children,
  })

  const contextValue: CodeBlockContextValue = {
    language,
    filename,
    lineCount,
    isExpanded,
    codeExpanded,
    copied,
    needsScroll,
    expandable,
    lineThreshold,
    handleExpand,
    handleCodeExpand,
    handleCopy,
    scrollRef: scrollRef as React.RefObject<HTMLDivElement>,
    contentRef: contentRef as React.RefObject<HTMLDivElement>,
    theme,
  }

  const injectedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child as React.ReactElement<{ codeBlock?: CodeBlockContextValue }>,
        {
          codeBlock: contextValue,
        },
      )
    }
    return child
  })

  return (
    <div
      className={tcx(
        "bg-secondary-background group relative overflow-hidden rounded-lg",
        className,
      )}
    >
      {injectedChildren}
    </div>
  )
})
