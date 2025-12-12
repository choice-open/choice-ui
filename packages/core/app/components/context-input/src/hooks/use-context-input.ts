import { useCallback, useEffect, useRef, useState } from "react"
import { Descendant, Editor, Point, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import type { ContextInputValue, MentionMatch } from "../types"
import { extractMentionContext, extractTextWithMentions, parseTextWithMentions } from "../utils"
import type { ContextEditor } from "../types/editor"

interface UseContextInputProps {
  autoFocus?: boolean
  editor?: ContextEditor
  onChange?: (value: ContextInputValue) => void
  value?: ContextInputValue
}

export const useContextInput = ({ value, onChange, editor, autoFocus }: UseContextInputProps) => {
  const isUpdatingRef = useRef(false)

  // Default empty paragraph structure
  const emptyParagraph = [
    { type: "paragraph", children: [{ text: "" }] },
  ] as unknown as Descendant[]

  // Internal state
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    // Initialize Slate value from value prop
    if (value?.text != null && value.text !== "") {
      try {
        return parseTextWithMentions(value.text, value.mentions || [])
      } catch {
        return emptyParagraph
      }
    }
    return emptyParagraph
  })

  // Timeout ref for autoFocus
  const autoFocusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Watch external value changes and sync to editor
  useEffect(() => {
    if (!editor || !value || isUpdatingRef.current) {
      return
    }

    let newSlateValue: Descendant[]
    try {
      newSlateValue =
        value.text != null && value.text !== ""
          ? parseTextWithMentions(value.text, value.mentions || [])
          : emptyParagraph
    } catch {
      newSlateValue = emptyParagraph
    }

    // Check if update is needed (avoid unnecessary updates)
    const currentText = extractTextWithMentions(editor.children).text
    if (currentText !== value.text) {
      try {
        // Use official recommended reset method
        Editor.withoutNormalizing(editor, () => {
          // Directly replace editor.children
          editor.children = newSlateValue as Descendant[]

          // After controlled value changes, always move cursor to end
          let endPoint: Point
          try {
            endPoint = Editor.end(editor, [])
          } catch {
            // If getting end position fails, use default position
            endPoint = { path: [0, 0], offset: 0 }
          }
          Transforms.select(editor, endPoint)

          // Trigger change event to update view
          editor.onChange()
        })

        // If autoFocus is enabled, refocus after update
        if (autoFocus) {
          // Clear previous timeout
          if (autoFocusTimeoutRef.current) {
            clearTimeout(autoFocusTimeoutRef.current)
          }
          // Use setTimeout to ensure DOM is updated before focusing
          autoFocusTimeoutRef.current = setTimeout(() => {
            try {
              ReactEditor.focus(editor)
            } catch {
              // Editor may not be mounted, ignore error
            }
          }, 0)
        }

        setSlateValue(newSlateValue as Descendant[])
      } catch {
        // Editor operation failed, ignore error
      }
    }
  }, [value, editor, autoFocus])

  // Cleanup all timeouts
  useEffect(() => {
    return () => {
      if (autoFocusTimeoutRef.current) {
        clearTimeout(autoFocusTimeoutRef.current)
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Ref for debounce
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingValueRef = useRef<Descendant[] | null>(null)

  // Handle editor value changes
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      // Prevent circular updates
      isUpdatingRef.current = true

      // Immediately update UI state
      setSlateValue(newValue)

      // Save pending value
      pendingValueRef.current = newValue

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Debounce text extraction and onChange callback
      debounceTimerRef.current = setTimeout(() => {
        const valueToProcess = pendingValueRef.current
        if (!valueToProcess || !onChange) {
          isUpdatingRef.current = false
          return
        }

        // Use custom extraction function
        const { text, mentionsData } = extractTextWithMentions(valueToProcess)
        const mentions: MentionMatch[] = []

        // Process mentions data
        for (const { element, startIndex, endIndex } of mentionsData) {
          const context = extractMentionContext(text, startIndex, endIndex)

          mentions.push({
            item: {
              id: element.mentionId,
              type: element.mentionType,
              label: element.mentionLabel,
              metadata: element.mentionData,
            },
            startIndex,
            endIndex,
            text: element.mentionLabel,
            context: {
              fullContext: context.fullContext,
              mentionText: context.mentionText,
            },
          })
        }

        onChange({ text, mentions })
        isUpdatingRef.current = false
      }, 100)
    },
    [onChange],
  )

  return {
    slateValue,
    handleChange,
  }
}
