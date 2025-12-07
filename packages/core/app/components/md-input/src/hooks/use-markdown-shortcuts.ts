import { useEventCallback } from "usehooks-ts"
import type { useMarkdownFormatting } from "./use-markdown-formatting"

interface UseMarkdownShortcutsProps {
  disabled?: boolean
  insertText: ReturnType<typeof useMarkdownFormatting>["insertText"]
  onChange?: (value: string) => void
  readOnly?: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
  wrapText: ReturnType<typeof useMarkdownFormatting>["wrapText"]
}

export function useMarkdownShortcuts(props: UseMarkdownShortcutsProps) {
  const { textareaRef, insertText, wrapText, onChange, disabled, readOnly } = props

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled || readOnly) return

    const isMetaKey = event.metaKey || event.ctrlKey
    if (!isMetaKey) return

    const textarea = textareaRef.current
    if (!textarea) return

    const isIMEComposing = event.nativeEvent.isComposing || event.keyCode === 229
    if (isIMEComposing) return

    switch (event.key.toLowerCase()) {
      case "b": {
        event.preventDefault()
        wrapText("**", "**", onChange)
        break
      }

      case "i": {
        event.preventDefault()
        wrapText("*", "*", onChange)
        break
      }

      case "k": {
        event.preventDefault()
        wrapText("[", "](url)", onChange)
        break
      }

      case "`": {
        if (event.shiftKey) {
          event.preventDefault()
          wrapText("```\n", "\n```", onChange)
        } else {
          event.preventDefault()
          wrapText("`", "`", onChange)
        }
        break
      }

      case ".": {
        if (event.shiftKey) {
          event.preventDefault()
          wrapText("> ", "", onChange)
        }
        break
      }

      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6": {
        event.preventDefault()
        const level = parseInt(event.key)
        const prefix = "#".repeat(level) + " "
        insertText(prefix, onChange)
        break
      }

      default:
        break
    }
  })

  return { handleKeyDown }
}
