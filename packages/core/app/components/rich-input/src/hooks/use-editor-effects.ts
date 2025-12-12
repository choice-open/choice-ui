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

  // Reset expanded state when paragraph style panel closes
  useEffect(() => {
    if (!isParagraphStyleOpen) {
      setIsParagraphExpanded(false)
    }
  }, [isParagraphStyleOpen, setIsParagraphExpanded])

  // Handle character style panel state changes
  useEffect(() => {
    if (!isCharactersStyleOpen) {
      setSwitchUrlInput(false)
    }

    // Save original methods
    const originalInsertText = editor.insertText
    const originalInsertBreak = editor.insertBreak

    // Override methods
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

    // Cleanup: restore original methods
    return () => {
      editor.insertText = originalInsertText
      editor.insertBreak = originalInsertBreak
    }
  }, [editor, isCharactersStyleOpen, setSwitchUrlInput])

  // Reset format when editor content changes
  useEffect(() => {
    // Safety check for value array
    if (!value || !Array.isArray(value) || value.length === 0) {
      return
    }
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

  // Scroll sync
  const updateFloating = useCallback(() => {
    // This function will be implemented in parent component
  }, [])

  return {
    updateFloating,
  }
}
