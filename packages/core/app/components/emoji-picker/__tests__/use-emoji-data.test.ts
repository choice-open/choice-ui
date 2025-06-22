import { renderHook, act } from "@testing-library/react"
import { useEmojiData, getEmojiCategory, type EmojiData } from "../hooks/use-emoji-data"

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Mock emoji data
const mockEmojis: EmojiData[] = [
  {
    id: 1,
    code: "U+1F600",
    emoji: "😀",
    name: "grinning face",
    nameUrl: "grinning-face",
  },
  {
    id: 2,
    code: "U+1F603",
    emoji: "😃",
    name: "grinning face with big eyes",
    nameUrl: "grinning-face-with-big-eyes",
  },
  {
    id: 465,
    code: "U+1F435",
    emoji: "🐵",
    name: "monkey face",
    nameUrl: "monkey-face",
  },
  {
    id: 592,
    code: "U+1F34E",
    emoji: "🍎",
    name: "red apple",
    nameUrl: "red-apple",
  },
]

jest.mock("../utils", () => ({
  emojis: mockEmojis,
}))

describe("useEmojiData", () => {
  const defaultProps = {
    searchQuery: "",
    columns: 8,
    showFrequentlyUsed: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should initialize with empty search results when no search query", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    expect(result.current.searchResults).toEqual([])
  })

  it("should return search results when search query is provided", () => {
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        searchQuery: "grinning",
      }),
    )

    expect(result.current.searchResults).toHaveLength(2)
    expect(result.current.searchResults[0].name).toBe("grinning face")
    expect(result.current.searchResults[1].name).toBe("grinning face with big eyes")
  })

  it("should search by emoji character", () => {
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        searchQuery: "😀",
      }),
    )

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].emoji).toBe("😀")
  })

  it("should search by nameUrl", () => {
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        searchQuery: "grinning-face",
      }),
    )

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].nameUrl).toBe("grinning-face")
  })

  it("should be case insensitive in search", () => {
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        searchQuery: "GRINNING",
      }),
    )

    expect(result.current.searchResults).toHaveLength(2)
  })

  it("should organize data into categories when not searching", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    expect(result.current.categorizedData.length).toBeGreaterThan(0)

    // Should have headers and emoji rows
    const hasHeaders = result.current.categorizedData.some((item) => item.type === "header")
    const hasEmojis = result.current.categorizedData.some((item) => item.type === "emojis")

    expect(hasHeaders).toBe(true)
    expect(hasEmojis).toBe(true)
  })

  it("should create category index map correctly", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    expect(result.current.categoryIndexMap).toBeInstanceOf(Map)
    expect(result.current.categoryIndexMap.size).toBeGreaterThan(0)
  })

  it("should not show frequently used when showFrequentlyUsed is false", () => {
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        showFrequentlyUsed: false,
      }),
    )

    const frequentlyUsedHeaders = result.current.categorizedData.filter(
      (item) => item.type === "header" && item.category === "frequently_used",
    )

    expect(frequentlyUsedHeaders).toHaveLength(0)
  })

  it("should load frequently used emojis from localStorage", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([1, 2]))

    const { result } = renderHook(() => useEmojiData(defaultProps))

    expect(localStorageMock.getItem).toHaveBeenCalledWith("emoji-picker-frequently-used")
    expect(result.current.frequentlyUsed).toHaveLength(2)
  })

  it("should handle localStorage errors gracefully", () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("Storage error")
    })

    const { result } = renderHook(() => useEmojiData(defaultProps))

    expect(result.current.frequentlyUsed).toEqual([])
  })

  it("should add emoji to frequently used", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    act(() => {
      result.current.addToFrequentlyUsed(1)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "emoji-picker-frequently-used",
      JSON.stringify([1]),
    )
  })

  it("should not add to frequently used when showFrequentlyUsed is false", () => {
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        showFrequentlyUsed: false,
      }),
    )

    act(() => {
      result.current.addToFrequentlyUsed(1)
    })

    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it("should find emoji position correctly", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    const testEmoji = mockEmojis[0]
    const position = result.current.findEmojiPosition(testEmoji)

    expect(position).not.toBeNull()
    expect(typeof position?.itemIndex).toBe("number")
    expect(typeof position?.emojiIndex).toBe("number")
  })

  it("should return null for emoji not found", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    const nonExistentEmoji: EmojiData = {
      id: 999,
      code: "U+9999",
      emoji: "🤖",
      name: "non-existent",
      nameUrl: "non-existent",
    }

    const position = result.current.findEmojiPosition(nonExistentEmoji)
    expect(position).toBeNull()
  })

  it("should find emoji by character", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    const found = result.current.findEmojiByChar("😀")
    expect(found).not.toBeNull()
    expect(found?.emoji).toBe("😀")
  })

  it("should return null for emoji character not found", () => {
    const { result } = renderHook(() => useEmojiData(defaultProps))

    const found = result.current.findEmojiByChar("🤖")
    expect(found).toBeNull()
  })

  it("should update categorized data when search query changes", () => {
    const { result, rerender } = renderHook(
      ({ searchQuery }) => useEmojiData({ ...defaultProps, searchQuery }),
      {
        initialProps: { searchQuery: "" },
      },
    )

    const initialLength = result.current.categorizedData.length

    rerender({ searchQuery: "grinning" })

    // When searching, categorized data should only contain emoji rows, no headers
    const searchingLength = result.current.categorizedData.length
    expect(searchingLength).toBeLessThan(initialLength)
  })

  it("should organize emojis into correct number of columns", () => {
    const columns = 4
    const { result } = renderHook(() =>
      useEmojiData({
        ...defaultProps,
        columns,
        searchQuery: "grinning", // Search to get predictable results
      }),
    )

    const emojiRows = result.current.categorizedData.filter((item) => item.type === "emojis")

    if (emojiRows.length > 0) {
      const firstRow = emojiRows[0] as { emojis: EmojiData[] }
      expect(firstRow.emojis.length).toBeLessThanOrEqual(columns)
    }
  })

  it("should handle empty frequently used list", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]))

    const { result } = renderHook(() => useEmojiData(defaultProps))

    expect(result.current.frequentlyUsed).toEqual([])

    // Should not show frequently used header when list is empty
    const frequentlyUsedHeaders = result.current.categorizedData.filter(
      (item) => item.type === "header" && item.category === "frequently_used",
    )
    expect(frequentlyUsedHeaders).toHaveLength(0)
  })
})

describe("getEmojiCategory", () => {
  it("should return correct category for smileys & people range", () => {
    expect(getEmojiCategory(1)).toBe("smileys_people")
    expect(getEmojiCategory(460)).toBe("smileys_people")
  })

  it("should return correct category for animals & nature range", () => {
    expect(getEmojiCategory(465)).toBe("animals_nature")
    expect(getEmojiCategory(591)).toBe("animals_nature")
  })

  it("should return correct category for food & drink range", () => {
    expect(getEmojiCategory(592)).toBe("food_drink")
    expect(getEmojiCategory(712)).toBe("food_drink")
  })

  it("should return default category for unknown ID", () => {
    expect(getEmojiCategory(9999)).toBe("symbols")
  })

  it("should handle edge cases", () => {
    expect(getEmojiCategory(0)).toBe("symbols")
    expect(getEmojiCategory(-1)).toBe("symbols")
  })
})
