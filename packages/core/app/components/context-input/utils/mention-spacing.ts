import { Editor, Transforms } from "slate"

/**
 * 检查是否需要在当前位置前面添加空格
 * @param editor - SlateJS 编辑器实例
 * @returns 是否需要添加前导空格
 */
export function shouldInsertSpaceBefore(editor: Editor): boolean {
  const { selection } = editor

  if (!selection) {
    return false
  }

  try {
    const before = Editor.before(editor, selection.anchor, { unit: "character" })
    if (before) {
      const beforeRange = Editor.range(editor, before, selection.anchor)
      const beforeText = Editor.string(editor, beforeRange)
      // 如果前一个字符不是空格或换行，需要添加空格
      return beforeText !== "" && beforeText !== " " && beforeText !== "\n"
    }
  } catch {
    // 如果出错，安全地假设不需要空格
    return false
  }

  return false
}

/**
 * 检查是否需要在当前位置后面添加空格
 * @param editor - SlateJS 编辑器实例
 * @returns 是否需要添加后导空格
 */
export function shouldInsertSpaceAfter(editor: Editor): boolean {
  const { selection } = editor

  if (!selection) {
    return true // 默认在结尾添加空格
  }

  try {
    const after = Editor.after(editor, selection.anchor, { unit: "character" })
    if (after) {
      const afterRange = Editor.range(editor, selection.anchor, after)
      const afterText = Editor.string(editor, afterRange)
      // 如果后一个字符不是空格或换行，需要添加空格
      return afterText !== "" && afterText !== " " && afterText !== "\n"
    }
  } catch {
    // 如果出错，安全地假设需要空格
    return true
  }

  return true // 默认在结尾添加空格
}

/**
 * 在当前位置智能插入空格（前导空格）
 * @param editor - SlateJS 编辑器实例
 * @returns 是否插入了空格
 */
export function insertSpaceBeforeIfNeeded(editor: Editor): boolean {
  if (shouldInsertSpaceBefore(editor)) {
    Transforms.insertText(editor, " ")
    return true
  }
  return false
}

/**
 * 在当前位置智能插入空格（后导空格）
 * @param editor - SlateJS 编辑器实例
 * @returns 是否插入了空格
 */
export function insertSpaceAfterIfNeeded(editor: Editor): boolean {
  if (shouldInsertSpaceAfter(editor)) {
    Transforms.insertText(editor, " ")
    return true
  }
  return false
}

/**
 * 为 mention 插入智能间距
 * 这个函数会在插入 mention 前后根据上下文智能添加空格
 * @param editor - SlateJS 编辑器实例
 * @param beforeInsertion - 在插入内容前执行的回调
 */
export function insertWithSmartSpacing(editor: Editor, beforeInsertion: () => void): void {
  // 在插入内容前检查是否需要前导空格
  const needsSpaceBefore = shouldInsertSpaceBefore(editor)

  // 插入前导空格（如果需要）
  if (needsSpaceBefore) {
    Transforms.insertText(editor, " ")
  }

  // 执行实际的插入操作
  beforeInsertion()

  // 参考官方案例：总是在 mention 后面插入空格
  // 官方案例的 onChange 逻辑期望 mention 后面有空格：afterText.match(/^(\s|$)/)
  Transforms.insertText(editor, " ")
}
