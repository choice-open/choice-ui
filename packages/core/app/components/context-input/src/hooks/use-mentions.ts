import { useCallback, useEffect, useMemo, useState } from "react"
import { Editor, Node, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import type { MentionItem, MentionTrigger } from "../types"
import { insertWithSmartSpacing } from "../utils"
import type { ContextEditor } from "../types/editor"

export interface MentionSearchState {
  index: number
  isSearching: boolean
  loading: boolean
  query: string
  suggestions: MentionItem[]
  target: Range | null
  trigger: string
}

export interface UseMentionsProps {
  editor: ContextEditor
  maxSuggestions?: number
  mentionPrefix?: string
  onMentionSelect?: (mention: MentionItem, trigger: string) => void
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
  })

  // 创建 triggers 的快速查找映射
  const triggerMap = useMemo(() => {
    const map = new Map<string, MentionTrigger>()
    triggers.forEach((trigger) => {
      map.set(trigger.char, trigger)
    })
    return map
  }, [triggers])

  // 搜索 mentions
  const searchMentions = useCallback(
    async (query: string, trigger: string, triggerConfig: MentionTrigger) => {
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
    },
    [maxSuggestions],
  )

  // 检查是否在 mention 搜索状态
  const checkMentionSearch = useCallback(() => {
    const { selection } = editor

    if (!selection || !Range.isCollapsed(selection)) {
      setSearchState((prev) => {
        // 只在状态真正改变时更新
        if (prev.isSearching) {
          return { ...prev, isSearching: false }
        }
        return prev
      })
      return
    }

    const [start] = Range.edges(selection)

    // 向前查找足够的字符来检测 mention
    let beforeRange
    try {
      // 尝试获取前面20个字符的范围
      const before = Editor.before(editor, start, { distance: 20, unit: "character" })
      if (before) {
        beforeRange = Editor.range(editor, before, start)
      } else {
        // 如果前面不足20个字符，就从段落开始
        const blockStart = Editor.start(editor, start.path.slice(0, -1))
        beforeRange = Editor.range(editor, blockStart, start)
      }
    } catch {
      // 如果出错，尝试从段落开始
      const blockStart = Editor.start(editor, start.path.slice(0, -1))
      beforeRange = Editor.range(editor, blockStart, start)
    }

    const beforeText = beforeRange ? Editor.string(editor, beforeRange) : ""

    if (!beforeText) {
      setSearchState((prev) => {
        // 只在状态真正改变时更新
        if (prev.isSearching) {
          return { ...prev, isSearching: false }
        }
        return prev
      })
      return
    }

    // 检查每个触发字符
    for (const [triggerChar, triggerConfig] of triggerMap) {
      const triggerIndex = beforeText.lastIndexOf(triggerChar)

      if (triggerIndex !== -1) {
        const queryText = beforeText.slice(triggerIndex + 1)
        const hasSpaceInQuery = queryText.includes(" ")

        // 检查是否允许查询中有空格
        if (hasSpaceInQuery && !triggerConfig.allowSpaceInQuery) {
          continue
        }

        // 检查自定义正则表达式
        if (triggerConfig.mentionRegex && !triggerConfig.mentionRegex.test(queryText)) {
          continue
        }

        // 计算从触发字符开始的精确范围
        let triggerPoint: Point
        try {
          const distance = beforeText.length - triggerIndex
          const before = Editor.before(editor, start, { distance, unit: "character" })
          triggerPoint = before || start
        } catch {
          // 如果出错，使用段落开始位置加上触发字符的偏移量
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

        // 创建从触发字符到当前光标位置的范围
        const target = Editor.range(editor, triggerPoint, start)

        setSearchState((prev) => ({
          ...prev,
          isSearching: true,
          trigger: triggerChar,
          query: queryText,
          target,
          index: 0,
        }))

        // 开始搜索
        searchMentions(queryText, triggerChar, triggerConfig)
        return
      }
    }

    // 没有找到有效的 mention 搜索
    setSearchState((prev) => {
      // 只在状态真正改变时更新
      if (prev.isSearching) {
        return { ...prev, isSearching: false }
      }
      return prev
    })
  }, [editor, searchMentions, triggerMap])

  // 插入 mention
  const insertMention = useCallback(
    (mention: MentionItem) => {
      const { target, trigger } = searchState

      if (!target) return

      Transforms.select(editor, target)

      // 删除触发字符和查询文本
      Transforms.delete(editor)

      // 使用智能间距插入 mention
      insertWithSmartSpacing(editor, () => {
        // 插入 mention 元素
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
        // 参考官方案例：移动光标到 mention 节点之后
        Transforms.move(editor)
      })

      // 重置搜索状态
      setSearchState((prev) => ({ ...prev, isSearching: false }))

      // 触发回调
      onMentionSelect?.(mention, trigger)
      onSearchClose?.()

      // Focus编辑器，确保光标在正确位置
      ReactEditor.focus(editor)
    },
    [editor, searchState, onMentionSelect, onSearchClose],
  )

  // 键盘导航
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
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
    },
    [searchState, insertMention],
  )

  // 获取建议列表的位置 - 格式化为 CoordinateMenu 所需格式
  const getSuggestionPosition = useCallback((): { x: number; y: number } | null => {
    if (!searchState.isSearching || !searchState.target) {
      return null
    }

    try {
      const domRange = ReactEditor.toDOMRange(editor, searchState.target)
      const rect = domRange.getBoundingClientRect()

      return {
        x: rect.left,
        y: rect.bottom + window.scrollY + 4, // 添加4px间距
      }
    } catch {
      return null
    }
  }, [editor, searchState.isSearching, searchState.target])

  // 监听编辑器内容变化
  useEffect(() => {
    // 如果没有触发器配置，就不需要检查
    if (triggers.length === 0) {
      return
    }

    checkMentionSearch()
  }, [checkMentionSearch, triggers.length])

  // 关闭 mentions 搜索
  const closeMentionSearch = useCallback(() => {
    setSearchState({
      isSearching: false,
      trigger: "",
      query: "",
      target: null,
      index: 0,
      suggestions: [],
      loading: false,
    })
  }, [])

  return {
    searchState,
    insertMention,
    handleKeyDown,
    getSuggestionPosition,
    closeMentionSearch,
    selectMention: (index: number) => {
      const mention = searchState.suggestions[index]
      if (mention) {
        insertMention(mention)
      }
    },
    selectNextMention: () => {
      setSearchState((prev) => ({
        ...prev,
        index: (prev.index + 1) % prev.suggestions.length,
      }))
    },
    selectPreviousMention: () => {
      setSearchState((prev) => ({
        ...prev,
        index: prev.index === 0 ? prev.suggestions.length - 1 : prev.index - 1,
      }))
    },
  }
}
