import { Editor } from "slate"
import isHotkey from "is-hotkey"
import type { CustomEditor } from "../types"

// 格式化热键映射
const HOTKEYS: Record<string, keyof Omit<TextFormat, "text">> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
}

// 定义文本格式接口
interface TextFormat {
  bold?: boolean
  italic?: boolean
  text: string
  underline?: boolean
}

// 为文本添加相应格式
export const toggleMark = (editor: CustomEditor, format: keyof Omit<TextFormat, "text">) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// 检查当前所选文本是否有特定格式
export const isMarkActive = (editor: CustomEditor, format: keyof Omit<TextFormat, "text">) => {
  const marks = Editor.marks(editor) as Partial<TextFormat> | null
  return marks ? marks[format] === true : false
}

// 处理所有热键
export const handleHotkeys = (event: React.KeyboardEvent, editor: CustomEditor) => {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault()
      const mark = HOTKEYS[hotkey]
      toggleMark(editor, mark)
      return true
    }
  }
  return false
}

export { HOTKEYS }
