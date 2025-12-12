import { useCallback, useEffect, useRef, useState } from "react"
import { Descendant, Editor, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import type { UseRichInputProps, CustomEditor } from "../types"

// Default empty paragraph structure
const EMPTY_PARAGRAPH = [{ type: "paragraph", children: [{ text: "" }] }] as unknown as Descendant[]

/**
 * Rich Input controlled component logic
 * Based on context-input implementation to solve Slate uncontrolled component issues
 */
export const useRichInput = ({
  value,
  onChange,
  editor,
  autoFocus,
  autoMoveToEnd,
}: UseRichInputProps) => {
  const isUpdatingRef = useRef(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Internal state - tracks Slate editor value
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    return value && Array.isArray(value) && value.length > 0 ? value : EMPTY_PARAGRAPH
  })

  // Watch external value changes and sync to editor
  useEffect(() => {
    if (!editor || !value || !Array.isArray(value) || isUpdatingRef.current) {
      return
    }

    // Check if update is needed (avoid unnecessary updates)
    const needsUpdate = JSON.stringify(editor.children) !== JSON.stringify(value)

    if (needsUpdate) {
      try {
        // Use official recommended reset method
        Editor.withoutNormalizing(editor as CustomEditor, () => {
          // Directly replace editor.children
          editor.children = value

          // Determine cursor position based on autoMoveToEnd
          if (autoMoveToEnd) {
            try {
              // Move cursor to end
              const endPoint = Editor.end(editor as CustomEditor, [])
              Transforms.select(editor as CustomEditor, endPoint)
            } catch {
              // Ignore cursor positioning errors
            }
          }

          // Trigger change event to update view
          ;(editor as CustomEditor).onChange()
        })
      } catch {
        // Ignore editor operation errors
      }

      // If autoFocus is enabled, refocus after update
      if (autoFocus) {
        // Use setTimeout to ensure DOM is updated before focusing
        setTimeout(() => {
          try {
            ReactEditor.focus(editor)
          } catch {
            // Ignore focus errors
          }
        }, 0)
      }

      setSlateValue(value)
    }
  }, [value, editor, autoFocus, autoMoveToEnd])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Debounced onChange callback - manual implementation to avoid lodash
  const debouncedOnChange = useCallback(
    (newValue: Descendant[]) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange?.(newValue)
      }, 100)
    },
    [onChange],
  )

  // Handle editor value changes
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      // Prevent circular updates
      isUpdatingRef.current = true

      setSlateValue(newValue)

      // Call external onChange
      debouncedOnChange(newValue)

      // Reset update flag
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    },
    [debouncedOnChange],
  )

  // Optimized onChange handler using useEventCallback
  const optimizedHandleChange = useEventCallback((newValue: Descendant[]) => {
    handleChange(newValue)
  })

  return {
    slateValue,
    handleChange: optimizedHandleChange,
  }
}
