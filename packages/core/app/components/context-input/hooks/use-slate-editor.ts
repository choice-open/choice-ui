import { useMemo } from "react"
import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withMaxLength } from "../extensions/with-max-length"
import { withMentions } from "../extensions/with-mentions"

export const useSlateEditor = (maxLength?: number) => {
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

  return editor
}
