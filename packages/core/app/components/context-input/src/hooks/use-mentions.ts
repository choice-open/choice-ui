import { useEffect, useMemo, useRef, useState } from "react"
import { Editor, Node, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import type { MentionItemProps, MentionTrigger } from "../types"
import { insertWithSmartSpacing } from "../utils"
import type { ContextEditor } from "../types/editor"

export interface MentionSearchState {
  index: number
  isSearching: boolean
  loading: boolean
  position: { x: number; y: number } | null
  query: string
  suggestions: MentionItemProps[]
  target: Range | null
  trigger: string
}

export interface UseMentionsProps {
  editor: ContextEditor
  maxSuggestions?: number
  mentionPrefix?: string
  onMentionSelect?: (mention: MentionItemProps, trigger: string) => void
  onSearchClose?: () => void
  triggers: MentionTrigger[]
}

export function useMentions({
  editor,
  triggers,
  maxSuggestions = 10,
  mentionPrefix = "@",
  onMentionSelect,
  onSearchClose,
}: UseMentionsProps) {
  const [searchState, setSearchState] = useState<MentionSearchState>({
    isSearching: false,
    trigger: "",
    query: "",
    target: null,
    index: 0,
    suggestions: [],
    loading: false,
    position: null,
  })

  // Create fast lookup map for triggers
  const triggerMap = useMemo(() => {
    const map = new Map<string, MentionTrigger>()
    triggers.forEach((trigger) => {
      map.set(trigger.char, trigger)
    })
    return map
  }, [triggers])

  // Ref for debounced search
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Search mentions - use useEventCallback to keep reference stable
  const searchMentions = useEventCallback(
    (query: string, trigger: string, triggerConfig: MentionTrigger) => {
      // Clear previous search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Debounce 150ms
      searchTimeoutRef.current = setTimeout(async () => {
        setSearchState((prev) => ({ ...prev, loading: true }))

        try {
          const results = await triggerConfig.onSearch(query, trigger)
          const limitedResults = results.slice(0, maxSuggestions)

          setSearchState((prev) => ({
            ...prev,
            suggestions: limitedResults,
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to search mentions:", error)
          setSearchState((prev) => ({
            ...prev,
            suggestions: [],
            loading: false,
          }))
        }
      }, 150)
    },
  )

  // Check if in mention search state - use useEventCallback to keep reference stable
  const checkMentionSearch = useEventCallback(() => {
    // No need to check if no trigger configs
    if (triggers.length === 0) {
      return
    }

    const { selection } = editor

    if (!selection || !Range.isCollapsed(selection)) {
      setSearchState((prev) => {
        if (prev.isSearching) {
          return { ...prev, isSearching: false }
        }
        return prev
      })
      return
    }

    const [start] = Range.edges(selection)

    // Look backward for enough characters to detect mention
    let beforeRange
    try {
      const before = Editor.before(editor, start, { distance: 20, unit: "character" })
      if (before) {
        beforeRange = Editor.range(editor, before, start)
      } else {
        const blockStart = Editor.start(editor, start.path.slice(0, -1))
        beforeRange = Editor.range(editor, blockStart, start)
      }
    } catch {
      const blockStart = Editor.start(editor, start.path.slice(0, -1))
      beforeRange = Editor.range(editor, blockStart, start)
    }

    const beforeText = beforeRange ? Editor.string(editor, beforeRange) : ""

    if (!beforeText) {
      setSearchState((prev) => {
        if (prev.isSearching) {
          return { ...prev, isSearching: false }
        }
        return prev
      })
      return
    }

    // Check each trigger character
    for (const [triggerChar, triggerConfig] of triggerMap) {
      const triggerIndex = beforeText.lastIndexOf(triggerChar)

      if (triggerIndex !== -1) {
        const queryText = beforeText.slice(triggerIndex + 1)
        const hasSpaceInQuery = queryText.includes(" ")

        if (hasSpaceInQuery && !triggerConfig.allowSpaceInQuery) {
          continue
        }

        if (triggerConfig.mentionRegex && !triggerConfig.mentionRegex.test(queryText)) {
          continue
        }

        let triggerPoint: Point
        try {
          const distance = beforeText.length - triggerIndex
          const before = Editor.before(editor, start, { distance, unit: "character" })
          triggerPoint = before || start
        } catch {
          const blockStart = Editor.start(editor, start.path.slice(0, -1))
          try {
            const triggerOffset = Editor.after(editor, blockStart, {
              distance: triggerIndex,
              unit: "character",
            })
            triggerPoint = triggerOffset || blockStart
          } catch {
            triggerPoint = blockStart
          }
        }

        const target = Editor.range(editor, triggerPoint, start)

        // Calculate position in event handler, not during render
        let position: { x: number; y: number } | null = null
        try {
          const domRange = ReactEditor.toDOMRange(editor, target)
          const rect = domRange.getBoundingClientRect()
          position = {
            x: rect.left,
            y: rect.bottom + 4,
          }
        } catch {
          // Ignore error
        }

        setSearchState((prev) => ({
          ...prev,
          isSearching: true,
          trigger: triggerChar,
          query: queryText,
          target,
          position,
          index: 0,
        }))

        searchMentions(queryText, triggerChar, triggerConfig)
        return
      }
    }

    setSearchState((prev) => {
      if (prev.isSearching) {
        return { ...prev, isSearching: false }
      }
      return prev
    })
  })

  // Insert mention - use useEventCallback to keep reference stable
  const insertMention = useEventCallback((mention: MentionItemProps) => {
    const { target, trigger } = searchState

    if (!target) return

    Transforms.select(editor, target)
    Transforms.delete(editor)

    insertWithSmartSpacing(editor, () => {
      const mentionElement: import("../types").ContextMentionElement = {
        type: "mention" as const,
        mentionType: mention.type,
        mentionId: mention.id,
        mentionLabel: mention.label,
        mentionPrefix: mentionPrefix,
        mentionData: mention.metadata,
        children: [{ text: "" }],
      }

      Transforms.insertNodes(editor, mentionElement as unknown as Node)
      Transforms.move(editor)
    })

    const currentSelection = editor.selection

    setSearchState((prev) => ({ ...prev, isSearching: false }))

    onMentionSelect?.(mention, trigger)
    onSearchClose?.()

    requestAnimationFrame(() => {
      if (currentSelection) {
        Transforms.select(editor, currentSelection)
      }
      ReactEditor.focus(editor)
    })
  })

  // Keyboard navigation - use useEventCallback to keep reference stable
  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (!searchState.isSearching || searchState.suggestions.length === 0) {
      return false
    }

    const { suggestions, index } = searchState

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setSearchState((prev) => ({
          ...prev,
          index: (prev.index + 1) % suggestions.length,
        }))
        return true

      case "ArrowUp":
        event.preventDefault()
        setSearchState((prev) => ({
          ...prev,
          index: prev.index === 0 ? suggestions.length - 1 : prev.index - 1,
        }))
        return true

      case "Tab":
      case "Enter": {
        event.preventDefault()
        const selectedMention = suggestions[index]
        if (selectedMention) {
          insertMention(selectedMention)
        }
        return true
      }

      case "Escape":
        event.preventDefault()
        setSearchState((prev) => ({ ...prev, isSearching: false }))
        return true
    }

    return false
  })

  // Close mentions search
  const closeMentionSearch = useEventCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    setSearchState({
      isSearching: false,
      trigger: "",
      query: "",
      target: null,
      index: 0,
      suggestions: [],
      loading: false,
      position: null,
    })
  })

  // Use useEventCallback to keep reference stable
  const selectMention = useEventCallback((index: number) => {
    const mention = searchState.suggestions[index]
    if (mention) {
      insertMention(mention)
    }
  })

  const selectNextMention = useEventCallback(() => {
    setSearchState((prev) => {
      if (prev.suggestions.length === 0) return prev
      return {
        ...prev,
        index: (prev.index + 1) % prev.suggestions.length,
      }
    })
  })

  const selectPreviousMention = useEventCallback(() => {
    setSearchState((prev) => {
      if (prev.suggestions.length === 0) return prev
      return {
        ...prev,
        index: prev.index === 0 ? prev.suggestions.length - 1 : prev.index - 1,
      }
    })
  })

  return {
    searchState,
    checkMentionSearch,
    insertMention,
    handleKeyDown,
    closeMentionSearch,
    selectMention,
    selectNextMention,
    selectPreviousMention,
  }
}
