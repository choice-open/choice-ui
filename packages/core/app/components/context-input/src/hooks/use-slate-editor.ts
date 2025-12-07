import { useMemo } from "react"
import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { type ReactEditor, withReact } from "slate-react"
import { withMaxLength, withMentions } from "../extensions"

export const useSlateEditor = (maxLength?: number): ReactEditor => {
  const editor = useMemo(() => {
    let editor = createEditor()
    editor = withReact(editor)
    editor = withHistory(editor)
    editor = withMentions(editor)

    // 如果设置了 maxLength，应用长度限制插件
    if (maxLength) {
      editor = withMaxLength(maxLength)(editor)
    }

    return editor
  }, [maxLength])

  return editor as ReactEditor
}
