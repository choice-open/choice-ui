import React, { useCallback, useMemo } from "react"
import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { ElementRender, ElementRenderProps, LeafRender, withHtml } from "../components"
import type { CustomEditor, UseEditorConfigProps } from "../types"
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts"

/**
 * 编辑器配置Hook - 分离编辑器创建和事件处理逻辑
 */
export const useEditorConfig = (props: UseEditorConfigProps) => {
  const { disableTabFocus, isParagraphExpanded, setIsParagraphExpanded } = props

  // 创建编辑器实例，使用useMemo缓存避免重复创建
  const editor = useMemo(() => withHtml(withReact(withHistory(createEditor()))) as CustomEditor, [])

  // 使用键盘快捷键Hook
  const { handleKeyDown } = useKeyboardShortcuts({
    editor,
    isParagraphExpanded,
    setIsParagraphExpanded,
    disableTabFocus,
  })

  // 渲染函数配置
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
