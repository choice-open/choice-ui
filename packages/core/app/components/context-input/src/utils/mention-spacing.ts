import { Editor, Transforms } from "slate"

/**
 * Check if a space should be inserted before the current position
 * @param editor - SlateJS editor instance
 * @returns Whether a leading space should be added
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
      // If previous character is not space or newline, need to add space
      return beforeText !== "" && beforeText !== " " && beforeText !== "\n"
    }
  } catch {
    // If error occurs, safely assume no space is needed
    return false
  }

  return false
}

/**
 * Check if a space should be inserted after the current position
 * @param editor - SlateJS editor instance
 * @returns Whether a trailing space should be added
 */
export function shouldInsertSpaceAfter(editor: Editor): boolean {
  const { selection } = editor

  if (!selection) {
    return true // Default to add space at the end
  }

  try {
    const after = Editor.after(editor, selection.anchor, { unit: "character" })
    if (after) {
      const afterRange = Editor.range(editor, selection.anchor, after)
      const afterText = Editor.string(editor, afterRange)
      // If next character is not space or newline, need to add space
      return afterText !== "" && afterText !== " " && afterText !== "\n"
    }
  } catch {
    // If error occurs, safely assume space is needed
    return true
  }

  return true // Default to add space at the end
}

/**
 * Smartly insert space at current position (leading space)
 * @param editor - SlateJS editor instance
 * @returns Whether a space was inserted
 */
export function insertSpaceBeforeIfNeeded(editor: Editor): boolean {
  if (shouldInsertSpaceBefore(editor)) {
    Transforms.insertText(editor, " ")
    return true
  }
  return false
}

/**
 * Smartly insert space at current position (trailing space)
 * @param editor - SlateJS editor instance
 * @returns Whether a space was inserted
 */
export function insertSpaceAfterIfNeeded(editor: Editor): boolean {
  if (shouldInsertSpaceAfter(editor)) {
    Transforms.insertText(editor, " ")
    return true
  }
  return false
}

/**
 * Insert smart spacing for mention
 * This function intelligently adds spaces before/after mention insertion based on context
 * @param editor - SlateJS editor instance
 * @param beforeInsertion - Callback to execute before content insertion
 */
export function insertWithSmartSpacing(editor: Editor, beforeInsertion: () => void): void {
  // Check if leading space is needed before inserting content
  const needsSpaceBefore = shouldInsertSpaceBefore(editor)

  // Insert leading space (if needed)
  if (needsSpaceBefore) {
    Transforms.insertText(editor, " ")
  }

  // Execute actual insertion operation
  beforeInsertion()

  // Reference official example: always insert space after mention
  // Official example's onChange logic expects space after mention: afterText.match(/^(\s|$)/)
  Transforms.insertText(editor, " ")
}
