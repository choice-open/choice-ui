import { useRef, useEffect, useCallback, useState, useMemo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useEventCallback } from "usehooks-ts"
import type { EmojiCategory, VirtualItem, EmojiData } from "./use-emoji-data"
import { getEmojiCategory } from "./use-emoji-data"

const ROW_HEIGHT = 32
const HEADER_HEIGHT = 32
const PADDING = 8

interface UseEmojiScrollProps {
  categorizedData: VirtualItem[]
  categoryIndexMap: Map<EmojiCategory, number>
  columns: number
  findEmojiPosition: (emoji: EmojiData) => { emojiIndex: number; itemIndex: number } | null
  searchQuery: string
  value?: EmojiData | null
}

export function useEmojiScroll({
  categorizedData,
  categoryIndexMap,
  findEmojiPosition,
  searchQuery,
  value,
  columns,
}: UseEmojiScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentVisibleCategory, setCurrentVisibleCategory] =
    useState<EmojiCategory>("frequently_used")
  const isScrollingToTarget = useRef(false)
  const isInternalUpdate = useRef(false)
  const scrollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const internalUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // virtualizer configuration
  const virtualizer = useVirtualizer({
    count: categorizedData.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: useCallback(
      (index: number) => {
        const item = categorizedData[index]
        return item?.type === "header" ? HEADER_HEIGHT : ROW_HEIGHT
      },
      [categorizedData],
    ),
    overscan: 5,
  })

  // listen to scroll event, update current visible category
  useEffect(() => {
    if (searchQuery.trim()) return
    if (isScrollingToTarget.current) return

    const visibleItems = virtualizer.getVirtualItems()
    if (visibleItems.length === 0) return

    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const scrollTop = scrollElement.scrollTop
    const viewportHeight = scrollElement.clientHeight
    const viewportCenter = scrollTop + viewportHeight / 2

    let currentCategory: EmojiCategory = "frequently_used"
    let minDistance = Infinity

    // find the category closest to the viewport center
    for (const item of visibleItems) {
      const data = categorizedData[item.index]
      if (data?.type === "header") {
        const itemTop = item.start + PADDING
        const itemCenter = itemTop + item.size / 2
        const distance = Math.abs(itemCenter - viewportCenter)

        if (distance < minDistance) {
          minDistance = distance
          currentCategory = data.category
        }
      }
    }

    // if no category header is found, infer from content
    if (minDistance === Infinity) {
      for (const item of visibleItems) {
        const data = categorizedData[item.index]
        if (data?.type === "emojis" && data.emojis.length > 0) {
          const itemTop = item.start + PADDING
          const itemCenter = itemTop + item.size / 2
          const distance = Math.abs(itemCenter - viewportCenter)

          if (distance < minDistance) {
            minDistance = distance
            const firstEmoji = data.emojis[0]
            currentCategory = getEmojiCategory(firstEmoji.id)
          }
        }
      }
    }

    // immediately update state, without using debounce
    if (currentCategory !== currentVisibleCategory) {
      setCurrentVisibleCategory(currentCategory)
    }
  }, [virtualizer.getVirtualItems(), categorizedData, searchQuery, currentVisibleCategory])

  // scroll to specified category
  const scrollToCategory = useEventCallback((category: EmojiCategory) => {
    // immediately update current visible category, give user immediate feedback
    setCurrentVisibleCategory(category)

    const categoryIndex = categoryIndexMap.get(category)
    if (categoryIndex !== undefined) {
      isScrollingToTarget.current = true

      virtualizer.scrollToIndex(categoryIndex, {
        align: "start",
        behavior: "auto",
      })

      // clear previous timeout to avoid memory leak
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current)
      }
      scrollingTimeoutRef.current = setTimeout(() => {
        isScrollingToTarget.current = false
      }, 100)
    }
  })

  // scroll to specified emoji
  const scrollToEmoji = useEventCallback((emoji: EmojiData) => {
    const position = findEmojiPosition(emoji)
    if (position) {
      isScrollingToTarget.current = true

      virtualizer.scrollToIndex(position.itemIndex, {
        align: "center",
        behavior: "auto",
      })

      // clear previous timeout to avoid memory leak
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current)
      }
      scrollingTimeoutRef.current = setTimeout(() => {
        isScrollingToTarget.current = false
      }, 100)
    }
  })

  // mark internal update
  const markInternalUpdate = useEventCallback(() => {
    isInternalUpdate.current = true
    // briefly mark and reset, avoid affecting subsequent external updates
    if (internalUpdateTimeoutRef.current) {
      clearTimeout(internalUpdateTimeoutRef.current)
    }
    internalUpdateTimeoutRef.current = setTimeout(() => {
      isInternalUpdate.current = false
    }, 50)
  })

  // cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current)
      }
      if (internalUpdateTimeoutRef.current) {
        clearTimeout(internalUpdateTimeoutRef.current)
      }
    }
  }, [])

  // when external value changes, automatically scroll to corresponding position (excluding internal updates)
  useEffect(() => {
    if (value && !searchQuery.trim() && !isInternalUpdate.current) {
      scrollToEmoji(value)
    }
  }, [value, scrollToEmoji, searchQuery])

  // content style
  const contentStyle = useMemo(() => {
    return {
      height: `${virtualizer.getTotalSize() + PADDING * 2}px`,
      width: `${ROW_HEIGHT * columns + PADDING * 2}px`,
    }
  }, [columns, virtualizer])

  return {
    scrollRef,
    virtualizer,
    currentVisibleCategory,
    contentStyle,
    scrollToCategory,
    scrollToEmoji,
    markInternalUpdate,
    ROW_HEIGHT,
    HEADER_HEIGHT,
    PADDING,
  }
}
