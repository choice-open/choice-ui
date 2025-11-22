import { useState } from "react"
import { useEventCallback } from "usehooks-ts"

interface UseCodeBlockProps {
  defaultCodeExpanded?: boolean
  defaultExpanded?: boolean
  onCodeExpandChange?: (expanded: boolean) => void
  onExpandChange?: (expanded: boolean) => void
  scrollToBottom?: (options?: { wait?: number }) => void
}

export function useCodeBlock({
  defaultExpanded = true,
  defaultCodeExpanded = false,
  onExpandChange,
  onCodeExpandChange,
  scrollToBottom,
}: UseCodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [codeExpanded, setCodeExpanded] = useState(defaultCodeExpanded)
  const [copied, setCopied] = useState(false)

  const handleExpand = useEventCallback(() => {
    const newValue = !isExpanded
    setIsExpanded(newValue)
    onExpandChange?.(newValue)
  })

  const handleCodeExpand = useEventCallback(() => {
    const newValue = !codeExpanded
    setCodeExpanded(newValue)
    onCodeExpandChange?.(newValue)
    scrollToBottom?.({
      wait: 100,
    })
  })

  const handleCopy = useEventCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  })

  return {
    isExpanded,
    codeExpanded,
    copied,
    handleExpand,
    handleCodeExpand,
    handleCopy,
  }
}
