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
    if (!code || typeof code !== "string") {
      return
    }

    const onSuccess = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    // Try modern Clipboard API first (requires HTTPS)
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(code)
        onSuccess()
        return
      } catch {
        // Clipboard API failed, try fallback
      }
    }

    // Fallback for non-HTTPS environments using execCommand
    const textArea = document.createElement("textarea")
    try {
      textArea.value = code
      // Avoid scrolling to bottom
      textArea.style.cssText =
        "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand("copy")
      if (successful) {
        onSuccess()
      }
    } catch {
      // execCommand failed, do nothing
    } finally {
      // Always clean up the textarea element
      if (textArea.parentNode) {
        textArea.parentNode.removeChild(textArea)
      }
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
