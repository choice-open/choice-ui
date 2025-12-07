import { useCallback, useEffect } from "react"
import { Editor, Element as SlateElement, Text, Transforms } from "slate"
import type { CustomElement, UseEditorEffectsProps } from "../types"

export const useEditorEffects = (props: UseEditorEffectsProps) => {
  const {
    editor,
    value,
    isCharactersStyleOpen,
    isParagraphStyleOpen,
    setIsParagraphExpanded,
    setSwitchUrlInput,
  } = props

  // 段落样式面板关闭时重置展开状态
  useEffect(() => {
    if (!isParagraphStyleOpen) {
      setIsParagraphExpanded(false)
    }
  }, [isParagraphStyleOpen, setIsParagraphExpanded])

  // 字符样式面板状态变化时的处理
  useEffect(() => {
    if (!isCharactersStyleOpen) {
      setSwitchUrlInput(false)
    }

    // 保存原始方法
    const originalInsertText = editor.insertText
    const originalInsertBreak = editor.insertBreak

    // 覆盖方法
    editor.insertText = (text: string) => {
      if (text === " " || text === "\n") {
        Editor.removeMark(editor, "link")
      }
      originalInsertText.call(editor, text)
    }

    editor.insertBreak = () => {
      Editor.removeMark(editor, "link")
      originalInsertBreak.call(editor)
    }

    // 清理：恢复原始方法
    return () => {
      editor.insertText = originalInsertText
      editor.insertBreak = originalInsertBreak
    }
  }, [editor, isCharactersStyleOpen, setSwitchUrlInput])

  // 编辑器内容变化时重置格式
  useEffect(() => {
    const firstNode = value[0]
    if (SlateElement.isElement(firstNode) && firstNode.children.length > 0) {
      const firstChild = firstNode.children[0]
      if (Text.isText(firstChild) && firstChild.text === "") {
        Editor.removeMark(editor, "link")
        Editor.removeMark(editor, "bold")
        Editor.removeMark(editor, "italic")
        Editor.removeMark(editor, "underlined")
        Editor.removeMark(editor, "strikethrough")
        Editor.removeMark(editor, "code")
        Transforms.setNodes(editor, { type: "paragraph" } as Partial<CustomElement>)
      }
    }
  }, [editor, value])

  // 滚动同步
  const updateFloating = useCallback(() => {
    // 这个函数将在父组件中实现
  }, [])

  return {
    updateFloating,
  }
}
