import { tcx } from "@choice-ui/shared"
import React, { memo } from "react"
import { useStickToBottom } from "use-stick-to-bottom"
import { CodeBlockCode, CodeBlockContent, CodeBlockFooter, CodeBlockHeader } from "./components"
import { useCodeBlock, useScrollDetection } from "./hooks"
import type { CodeBlockContextValue, CodeBlockProps } from "./types"
import { extractCodeFromChildren } from "./utils"

export const CodeBlockRoot = memo(function CodeBlock(props: CodeBlockProps) {
  const {
    children,
    className,
    filename,
    language = "code",
    lineThreshold,
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

  // Extract code content once and memoize - used for copy and line count
  const codeContent = React.useMemo(() => extractCodeFromChildren(children), [children])
  const lineCount = React.useMemo(
    () => (codeContent ? codeContent.split("\n").length : 0),
    [codeContent],
  )

  // Wrap the copy handler to use the extracted code content
  const handleCopy = React.useCallback(
    (code?: string) => {
      const codeToUse = code || codeContent
      if (codeToUse) {
        originalHandleCopy(codeToUse)
      }
    },
    [originalHandleCopy, codeContent],
  )
  const needsScroll = useScrollDetection({
    scrollRef,
    contentRef,
    isExpanded,
    codeExpanded,
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
        "group/code-block relative flex flex-col overflow-hidden rounded-lg",
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
