import { tcx } from "@choice-ui/shared"
import React, { memo } from "react"
import { useStickToBottom } from "use-stick-to-bottom"
import { CodeBlockCode, CodeBlockContent, CodeBlockFooter, CodeBlockHeader } from "./components"
import { useCodeBlock, useLineCount, useScrollDetection } from "./hooks"
import type { CodeBlockContextValue, CodeBlockProps } from "./types"

export const CodeBlockRoot = memo(function CodeBlock(props: CodeBlockProps) {
  const {
    children,
    className,
    filename,
    language = "code",
    lineThreshold = 20,
    expandable = true,
    defaultExpanded = true,
    defaultCodeExpanded = false,
    variant = "default",
    onExpandChange,
    onCodeExpandChange,
  } = props

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
    try {
      // Find BlockCode component in children to extract code
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props) {
          // Check if it's BlockCode component by looking for code prop
          if (child.props.code && typeof child.props.code === "string") {
            codeContentRef.current = child.props.code
          }
        }
      })
    } catch {
      // Fallback: keep existing code content
    }
  }, [children])

  const lineCount = useLineCount(children)
  const needsScroll = useScrollDetection({
    scrollRef,
    contentRef,
    isExpanded,
    codeExpanded,
    children,
  })

  const contextValue = React.useMemo<CodeBlockContextValue>(
    () => ({
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
      variant,
    }),
    [
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
      scrollRef,
      contentRef,
      variant,
    ],
  )

  const injectedChildren = React.useMemo(() => {
    try {
      return React.Children.map(children, (child) => {
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
    } catch {
      // Fallback: return children as-is if cloning fails
      return children
    }
  }, [children, contextValue])

  return (
    <div
      className={tcx(
        "group/code-block relative overflow-hidden rounded-lg",
        variant === "default" && "bg-secondary-background",
        variant === "light" && "bg-gray-100",
        variant === "dark" && "bg-gray-700",
        className,
      )}
    >
      {injectedChildren}
    </div>
  )
})

export const CodeBlock = Object.assign(CodeBlockRoot, {
  Code: CodeBlockCode,
  Content: CodeBlockContent,
  Footer: CodeBlockFooter,
  Header: CodeBlockHeader,
})
