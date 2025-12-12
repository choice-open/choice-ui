import React, { useCallback, useMemo } from "react"
import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { ElementRender, ElementRenderProps, LeafRender, withHtml } from "../components"
import type { CustomEditor, UseEditorConfigProps } from "../types"
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts"

/**
 * Editor Config Hook - Separates editor creation and event handling logic
 */
export const useEditorConfig = (props: UseEditorConfigProps) => {
  const { disableTabFocus, isParagraphExpanded, setIsParagraphExpanded } = props

  // Create editor instance, use useMemo to avoid recreating
  const editor = useMemo(() => withHtml(withReact(withHistory(createEditor()))) as CustomEditor, [])

  // Use keyboard shortcuts hook
  const { handleKeyDown } = useKeyboardShortcuts({
    editor,
    isParagraphExpanded,
    setIsParagraphExpanded,
    disableTabFocus,
  })

  // Render function config
  const renderElement = useCallback((props: import("slate-react").RenderElementProps) => {
    return React.createElement(ElementRender, props as ElementRenderProps)
  }, [])

  const renderLeaf = useCallback((props: import("slate-react").RenderLeafProps) => {
    return React.createElement(LeafRender, props)
  }, [])

  return {
    editor,
    handleKeyDown,
    renderElement,
    renderLeaf,
  }
}
