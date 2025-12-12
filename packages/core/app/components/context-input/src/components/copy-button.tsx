import { IconButton, type IconButtonProps } from "@choice-ui/icon-button"
import { Check, CopySmall } from "@choiceform/icons-react"
import React, { useContext, useState } from "react"
import { ContextInputEditorContext } from "../hooks"
import { convertSlateToText } from "../utils"

export interface CopyButtonProps extends Omit<IconButtonProps, "onClick"> {
  onClick?: (copiedText: string) => void
  successDuration?: number
}

const CopyButtonComponent = function CopyButton({
  disabled = false,
  successDuration = 2000,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const editor = useContext(ContextInputEditorContext)

  const handleCopy = async () => {
    if (!editor) {
      console.warn("CopyButton must be used within ContextInput")
      return
    }

    try {
      // Convert SlateJS content to string
      const textContent = convertSlateToText(editor.children)

      // Copy to clipboard
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        console.warn("Clipboard API not available")
        return
      }
      await navigator.clipboard.writeText(textContent)

      // Set success state
      setCopied(true)

      // Trigger callback
      onClick?.(textContent)

      // Reset state
      setTimeout(() => setCopied(false), successDuration)
    } catch (error) {
      console.error("Failed to copy content:", error)
    }
  }

  return (
    <IconButton
      disabled={disabled}
      onClick={handleCopy}
      {...props}
    >
      {copied ? <Check /> : <CopySmall />}
    </IconButton>
  )
}

// Use React.memo to optimize render performance
export const CopyButton = React.memo(CopyButtonComponent)
