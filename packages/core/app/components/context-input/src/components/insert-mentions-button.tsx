import { IconButton, type IconButtonProps } from "@choice-ui/icon-button"
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
      // Ensure editor has focus
      ReactEditor.focus(editor)

      // Check and insert leading space (if needed)
      insertSpaceBeforeIfNeeded(editor)

      // Insert @ symbol at current cursor position
      Transforms.insertText(editor, "@")

      // Trigger callback
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
