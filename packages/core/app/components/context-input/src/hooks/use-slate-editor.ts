import { useMemo } from "react"
import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withMaxLength, withMentions } from "../extensions"
import type { ContextEditor } from "../types/editor"

export const useSlateEditor = (maxLength?: number): ContextEditor => {
  const editor = useMemo(() => {
    let editor = createEditor()
    editor = withReact(editor)
    editor = withHistory(editor)
    editor = withMentions(editor)

    // If maxLength is set, apply length limit plugin
    if (maxLength) {
      editor = withMaxLength(maxLength)(editor)
    }

    return editor
  }, [maxLength])

  return editor as ContextEditor
}
