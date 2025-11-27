import { useMemo, useState, useEffect } from "react"
import { isBrowser } from "~/utils"
import { emojis } from "../utils"

export interface EmojiData {
  code: string
  emoji: string
  id: number
  name: string
  nameUrl: string
}

export type EmojiCategory =
  | "frequently_used"
  | "smileys_people"
  | "animals_nature"
  | "food_drink"
  | "activities"
  | "travel_places"
  | "objects"
  | "symbols"
  | "flags"

export type VirtualItem =
  | {
      category: EmojiCategory
      title: string
      type: "header"
    }
  | {
      emojis: EmojiData[]
      type: "emojis"
    }

// 分类配置
export const categories = [
  { id: "frequently_used", name: "Frequently used" },
  { id: "smileys_people", name: "Smileys & People", range: [1, 460] },
  { id: "animals_nature", name: "Animals & Nature", range: [465, 591] },
  { id: "food_drink", name: "Food & Drink", range: [592, 712] },
  { id: "travel_places", name: "Travel & Places", range: [713, 922] },
  { id: "activities", name: "Activities", range: [923, 1001] },
  { id: "objects", name: "Objects", range: [1002, 1234] },
  { id: "symbols", name: "Symbols", range: [1235, 1451] },
  { id: "flags", name: "Flags", range: [1452, 1719] },
] as const

const STORAGE_KEY = "emoji-picker-frequently-used"

// 根据 ID 获取分类
export function getEmojiCategory(id: number): EmojiCategory {
  for (const category of categories) {
    if (
      "range" in category &&
      category.range &&
      id >= category.range[0] &&
      id <= category.range[1]
    ) {
      return category.id as EmojiCategory
    }
  }
  return "symbols"
}

function getFrequentlyUsedEmojis(): EmojiData[] {
  if (!isBrowser) return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const ids: number[] = JSON.parse(stored)
    return ids.map((id) => emojis.find((emoji) => emoji.id === id)).filter(Boolean) as EmojiData[]
  } catch {
    return []
  }
}

function saveFrequentlyUsedEmoji(emojiId: number) {
  if (!isBrowser) return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let ids: number[] = stored ? JSON.parse(stored) : []

    ids = ids.filter((id) => id !== emojiId)
    ids.unshift(emojiId)
    ids = ids.slice(0, 24)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // 忽略存储错误
  }
}

interface UseEmojiDataProps {
  columns: number
  searchQuery: string
  showFrequentlyUsed: boolean
}

export function useEmojiData({ searchQuery, columns, showFrequentlyUsed }: UseEmojiDataProps) {
  const [frequentlyUsed, setFrequentlyUsed] = useState<EmojiData[]>([])

  // 加载 frequently used emojis (仅在启用时)
  useEffect(() => {
    if (showFrequentlyUsed) {
      setFrequentlyUsed(getFrequentlyUsedEmojis())
    }
  }, [showFrequentlyUsed])

  // 搜索时的过滤数据
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    return emojis.filter(
      (emoji: EmojiData) =>
        emoji.name.toLowerCase().includes(query) ||
        emoji.emoji.includes(query) ||
        emoji.nameUrl.toLowerCase().includes(query),
    )
  }, [searchQuery])

  // 按分类组织的虚拟化数据
  const categorizedData = useMemo((): VirtualItem[] => {
    // 搜索模式时，只显示搜索结果
    if (searchQuery.trim()) {
      const items: VirtualItem[] = []
      for (let i = 0; i < searchResults.length; i += columns) {
        items.push({
          type: "emojis",
          emojis: searchResults.slice(i, i + columns),
        })
      }
      return items
    }

    // 正常模式：显示所有分类
    const items: VirtualItem[] = []

    // 1. Frequently Used (仅在启用时显示)
    if (showFrequentlyUsed && frequentlyUsed.length > 0) {
      items.push({
        type: "header",
        category: "frequently_used",
        title: "Frequently used",
      })

      for (let i = 0; i < frequentlyUsed.length; i += columns) {
        items.push({
          type: "emojis",
          emojis: frequentlyUsed.slice(i, i + columns),
        })
      }
    }

    // 2. 其他分类
    categories.slice(1).forEach((category) => {
      if (!("range" in category) || !category.range) return

      const categoryEmojis = emojis.filter(
        (emoji) => emoji.id >= category.range![0] && emoji.id <= category.range![1],
      )

      if (categoryEmojis.length > 0) {
        items.push({
          type: "header",
          category: category.id as EmojiCategory,
          title: category.name,
        })

        for (let i = 0; i < categoryEmojis.length; i += columns) {
          items.push({
            type: "emojis",
            emojis: categoryEmojis.slice(i, i + columns),
          })
        }
      }
    })

    return items
  }, [searchQuery, searchResults, frequentlyUsed, columns, showFrequentlyUsed])

  // 分类索引映射
  const categoryIndexMap = useMemo(() => {
    const map = new Map<EmojiCategory, number>()

    categorizedData.forEach((item, index) => {
      if (item.type === "header") {
        map.set(item.category, index)
      }
    })

    return map
  }, [categorizedData])

  // 添加到常用 (仅在启用时)
  const addToFrequentlyUsed = (emojiId: number) => {
    if (showFrequentlyUsed) {
      saveFrequentlyUsedEmoji(emojiId)
      setFrequentlyUsed(getFrequentlyUsedEmojis())
    }
  }

  // 根据 emoji 查找其在数据中的位置
  const findEmojiPosition = (
    emoji: EmojiData,
  ): { emojiIndex: number; itemIndex: number } | null => {
    for (let i = 0; i < categorizedData.length; i++) {
      const item = categorizedData[i]
      if (item.type === "emojis") {
        const emojiIndex = item.emojis.findIndex((e) => e.id === emoji.id)
        if (emojiIndex !== -1) {
          return { itemIndex: i, emojiIndex }
        }
      }
    }
    return null
  }

  // 根据 emoji 字符查找对应的 EmojiData
  const findEmojiByChar = (emojiChar: string): EmojiData | null => {
    return emojis.find((emoji) => emoji.emoji === emojiChar) || null
  }

  return {
    categorizedData,
    categoryIndexMap,
    searchResults,
    frequentlyUsed,
    addToFrequentlyUsed,
    findEmojiPosition,
    findEmojiByChar,
  }
}
