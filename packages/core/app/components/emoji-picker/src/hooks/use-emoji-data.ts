import { isBrowser } from "@choice-ui/shared"
import { useEffect, useMemo, useState } from "react"
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

// category configuration (id and range only, names come from i18n)
export const categories = [
  { id: "frequently_used" },
  { id: "smileys_people", range: [1, 460] },
  { id: "animals_nature", range: [465, 591] },
  { id: "food_drink", range: [592, 712] },
  { id: "travel_places", range: [713, 922] },
  { id: "activities", range: [923, 1001] },
  { id: "objects", range: [1002, 1234] },
  { id: "symbols", range: [1235, 1451] },
  { id: "flags", range: [1452, 1719] },
] as const

const STORAGE_KEY = "emoji-picker-frequently-used"

// get category by id
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
    // ignore storage error
  }
}

export interface CategoryNames {
  activities: string
  animalsNature: string
  flags: string
  foodDrink: string
  frequentlyUsed: string
  objects: string
  smileysPeople: string
  symbols: string
  travelPlaces: string
}

interface UseEmojiDataProps {
  categoryNames?: CategoryNames
  columns: number
  searchQuery: string
  showFrequentlyUsed: boolean
}

const defaultCategoryNames: CategoryNames = {
  frequentlyUsed: "Frequently used",
  smileysPeople: "Smileys & People",
  animalsNature: "Animals & Nature",
  foodDrink: "Food & Drink",
  travelPlaces: "Travel & Places",
  activities: "Activities",
  objects: "Objects",
  symbols: "Symbols",
  flags: "Flags",
}

// map category id to i18n key
const categoryIdToI18nKey: Record<string, keyof CategoryNames> = {
  frequently_used: "frequentlyUsed",
  smileys_people: "smileysPeople",
  animals_nature: "animalsNature",
  food_drink: "foodDrink",
  travel_places: "travelPlaces",
  activities: "activities",
  objects: "objects",
  symbols: "symbols",
  flags: "flags",
}

export function useEmojiData({
  searchQuery,
  columns,
  showFrequentlyUsed,
  categoryNames = defaultCategoryNames,
}: UseEmojiDataProps) {
  const [frequentlyUsed, setFrequentlyUsed] = useState<EmojiData[]>([])

  // load frequently used emojis (only when enabled)
  useEffect(() => {
    if (showFrequentlyUsed) {
      setFrequentlyUsed(getFrequentlyUsedEmojis())
    }
  }, [showFrequentlyUsed])

  // filter data when searching
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

  // virtualized data organized by category
  const categorizedData = useMemo((): VirtualItem[] => {
    // when in search mode, only show search results
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

    // normal mode: show all categories
    const items: VirtualItem[] = []

    // 1. Frequently Used (only when enabled)
    if (showFrequentlyUsed && frequentlyUsed.length > 0) {
      items.push({
        type: "header",
        category: "frequently_used",
        title: categoryNames.frequentlyUsed,
      })

      for (let i = 0; i < frequentlyUsed.length; i += columns) {
        items.push({
          type: "emojis",
          emojis: frequentlyUsed.slice(i, i + columns),
        })
      }
    }

    // 2. other categories
    categories.slice(1).forEach((category) => {
      if (!("range" in category) || !category.range) return

      const categoryEmojis = emojis.filter(
        (emoji) => emoji.id >= category.range![0] && emoji.id <= category.range![1],
      )

      if (categoryEmojis.length > 0) {
        const i18nKey = categoryIdToI18nKey[category.id]
        items.push({
          type: "header",
          category: category.id as EmojiCategory,
          title: i18nKey ? categoryNames[i18nKey] : category.id,
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
  }, [searchQuery, searchResults, frequentlyUsed, columns, showFrequentlyUsed, categoryNames])

  // category index mapping
  const categoryIndexMap = useMemo(() => {
    const map = new Map<EmojiCategory, number>()

    categorizedData.forEach((item, index) => {
      if (item.type === "header") {
        map.set(item.category, index)
      }
    })

    return map
  }, [categorizedData])

  // add to frequently used (only when enabled)
  const addToFrequentlyUsed = (emojiId: number) => {
    if (showFrequentlyUsed) {
      saveFrequentlyUsedEmoji(emojiId)
      setFrequentlyUsed(getFrequentlyUsedEmojis())
    }
  }

  // find the position of the emoji in the data
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

  // find the corresponding EmojiData by emoji character
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
