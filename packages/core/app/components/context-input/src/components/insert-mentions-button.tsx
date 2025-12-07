import { IconButton, type IconButtonProps } from "@choiceform/icon-button"
import { ApplyVariable } from "@choiceform/icons-react"
import { memo } from "react"
import { Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { useContextInputEditor } from "../hooks"
import { insertSpaceBeforeIfNeeded } from "../utils"

interface InsertMentionsButtonProps extends IconButtonProps {
  onClick?: () => void
}

export const InsertMentionsButton = memo(function InsertMentionsButton({
  disabled = false,
  onClick,
  ...props
}: InsertMentionsButtonProps) {
  const editor = useContextInputEditor()

  const handleInsertMention = () => {
    try {
      // 确保编辑器有焦点
      ReactEditor.focus(editor)

      // 检查并插入前导空格（如果需要）
      insertSpaceBeforeIfNeeded(editor)

      // 在当前光标位置插入 @ 符号
      Transforms.insertText(editor, "@")

      // 触发回调
      onClick?.()
    } catch (error) {
      console.warn("Failed to insert mention trigger:", error)
    }
  }

  return (
    <IconButton
      disabled={disabled}
      onClick={handleInsertMention}
      {...props}
    >
      <ApplyVariable />
    </IconButton>
  )
})
