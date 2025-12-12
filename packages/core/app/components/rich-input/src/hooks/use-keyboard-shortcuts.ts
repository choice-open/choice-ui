import { useEventCallback } from "usehooks-ts"
import { CustomEditor } from "../types"
import { toggleBlock, toggleMark } from "../utils"

interface UseKeyboardShortcutsProps {
  disableTabFocus?: boolean
  editor: CustomEditor
  isParagraphExpanded?: boolean
  setIsParagraphExpanded?: (value: boolean) => void
}

/**
 * Keyboard Shortcuts Management Hook
 *
 * Shortcuts:
 * - Code mode: Meta + /
 * - Headings H1-H6: Meta + 1/2/3/4/5/6
 * - Bold: Meta + B
 * - Italic: Meta + I
 * - Underline: Meta + U
 * - ESC: Close paragraph menu
 * - Tab: Disable focus switch based on config
 */
export const useKeyboardShortcuts = (props: UseKeyboardShortcutsProps) => {
  const { editor, isParagraphExpanded, setIsParagraphExpanded, disableTabFocus } = props

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    event.stopPropagation()

    // ESC key closes expanded paragraph menu
    if (event.key === "Escape" && isParagraphExpanded && setIsParagraphExpanded) {
      event.preventDefault()
      setIsParagraphExpanded(false)
      return
    }

    // Tab key handling (if disabled)
    if (disableTabFocus && event.key === "Tab") {
      event.preventDefault()
      return
    }

    // Check if Meta (Mac) or Ctrl (Windows/Linux) key is pressed
    const isMetaKey = event.metaKey || event.ctrlKey

    if (!isMetaKey) return

    // Handle shortcuts
    switch (event.key.toLowerCase()) {
      // Code mode: Meta + /
      case "/":
        event.preventDefault()
        toggleBlock(editor, "code")
        break

      // Headings H1-H6: Meta + 1-6
      case "1":
        event.preventDefault()
        toggleBlock(editor, "h1")
        break
      case "2":
        event.preventDefault()
        toggleBlock(editor, "h2")
        break
      case "3":
        event.preventDefault()
        toggleBlock(editor, "h3")
        break
      case "4":
        event.preventDefault()
        toggleBlock(editor, "h4")
        break
      case "5":
        event.preventDefault()
        toggleBlock(editor, "h5")
        break
      case "6":
        event.preventDefault()
        toggleBlock(editor, "h6")
        break

      // Bold: Meta + B
      case "b":
        event.preventDefault()
        toggleMark(editor, "bold")
        break

      // Italic: Meta + I
      case "i":
        event.preventDefault()
        toggleMark(editor, "italic")
        break

      // Underline: Meta + U
      case "u":
        event.preventDefault()
        toggleMark(editor, "underlined")
        break

      // Strikethrough: Meta + Shift + S
      case "s":
        if (event.shiftKey) {
          event.preventDefault()
          toggleMark(editor, "strikethrough")
        }
        break

      // Block quote: Meta + Shift + >
      case ".":
        if (event.shiftKey) {
          // Shift + . = >
          event.preventDefault()
          toggleBlock(editor, "block_quote")
        }
        break

      default:
        // Don't handle other shortcuts
        break
    }
  })

  return { handleKeyDown }
}
