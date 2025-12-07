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
 * 键盘快捷键管理Hook
 *
 * 快捷键列表：
 * - 代码模式: Meta + /
 * - 标题 H1-H6: Meta + 1/2/3/4/5/6
 * - 加粗: Meta + B
 * - 斜体: Meta + I
 * - 下划线: Meta + U
 * - ESC: 关闭段落菜单
 * - Tab: 根据配置禁用焦点切换
 */
export const useKeyboardShortcuts = (props: UseKeyboardShortcutsProps) => {
  const { editor, isParagraphExpanded, setIsParagraphExpanded, disableTabFocus } = props

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    event.stopPropagation()

    // ESC 键关闭展开的段落菜单
    if (event.key === "Escape" && isParagraphExpanded && setIsParagraphExpanded) {
      event.preventDefault()
      setIsParagraphExpanded(false)
      return
    }

    // Tab 键处理（如果禁用）
    if (disableTabFocus && event.key === "Tab") {
      event.preventDefault()
      return
    }

    // 检查是否按下了 Meta (Mac) 或 Ctrl (Windows/Linux) 键
    const isMetaKey = event.metaKey || event.ctrlKey

    if (!isMetaKey) return

    // 处理快捷键
    switch (event.key.toLowerCase()) {
      // 代码模式: Meta + /
      case "/":
        event.preventDefault()
        toggleBlock(editor, "code")
        break

      // 标题 H1-H6: Meta + 1-6
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

      // 加粗: Meta + B
      case "b":
        event.preventDefault()
        toggleMark(editor, "bold")
        break

      // 斜体: Meta + I
      case "i":
        event.preventDefault()
        toggleMark(editor, "italic")
        break

      // 下划线: Meta + U
      case "u":
        event.preventDefault()
        toggleMark(editor, "underlined")
        break

      // 删除线: Meta + Shift + S
      case "s":
        if (event.shiftKey) {
          event.preventDefault()
          toggleMark(editor, "strikethrough")
        }
        break

      // 引用块: Meta + Shift + >
      case ".":
        if (event.shiftKey) {
          // Shift + . = >
          event.preventDefault()
          toggleBlock(editor, "block_quote")
        }
        break

      default:
        // 不处理其他快捷键
        break
    }
  })

  return { handleKeyDown }
}
