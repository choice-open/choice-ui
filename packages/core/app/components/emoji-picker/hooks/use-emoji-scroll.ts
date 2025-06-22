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

  // 虚拟化配置
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

  // 监听滚动事件，更新当前可见分类
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

    // 找到最接近视口中心的分类
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

    // 如果没有找到分类头，根据内容推断
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

    // 立即更新状态，不使用防抖
    if (currentCategory !== currentVisibleCategory) {
      setCurrentVisibleCategory(currentCategory)
    }
  }, [virtualizer.getVirtualItems(), categorizedData, searchQuery, currentVisibleCategory])

  // 滚动到指定分类
  const scrollToCategory = useEventCallback((category: EmojiCategory) => {
    // 立即更新当前可见分类，给用户即时反馈
    setCurrentVisibleCategory(category)

    const categoryIndex = categoryIndexMap.get(category)
    if (categoryIndex !== undefined) {
      isScrollingToTarget.current = true

      virtualizer.scrollToIndex(categoryIndex, {
        align: "start",
        behavior: "auto",
      })

      setTimeout(() => {
        isScrollingToTarget.current = false
      }, 100)
    }
  })

  // 滚动到指定 emoji
  const scrollToEmoji = useEventCallback((emoji: EmojiData) => {
    const position = findEmojiPosition(emoji)
    if (position) {
      isScrollingToTarget.current = true

      virtualizer.scrollToIndex(position.itemIndex, {
        align: "center",
        behavior: "auto",
      })

      setTimeout(() => {
        isScrollingToTarget.current = false
      }, 100)
    }
  })

  // 标记内部更新
  const markInternalUpdate = useEventCallback(() => {
    isInternalUpdate.current = true
    // 短暂标记后重置，避免影响后续的外部更新
    setTimeout(() => {
      isInternalUpdate.current = false
    }, 50)
  })

  // 当外部 value 变化时，自动滚动到对应位置（排除内部更新）
  useEffect(() => {
    if (value && !searchQuery.trim() && !isInternalUpdate.current) {
      scrollToEmoji(value)
    }
  }, [value, scrollToEmoji, searchQuery])

  // 内容样式
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
