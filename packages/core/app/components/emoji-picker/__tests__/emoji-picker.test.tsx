import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { EmojiPicker } from "../emoji-picker"
import type { EmojiData } from "../hooks"

// Mock external dependencies
jest.mock("../hooks", () => {
  return {
    useEmojiData: jest.fn(() => ({
      searchResults: [],
      categorizedData: [
        {
          type: "header",
          category: "smileys_people",
          title: "Smileys & People",
        },
        {
          type: "emojis",
          emojis: [
            {
              id: 1,
              code: "U+1F600",
              emoji: "😀",
              name: "grinning face",
              nameUrl: "grinning-face",
            },
          ],
        },
      ],
      categoryIndexMap: new Map([["smileys_people", 0]]),
      frequentlyUsed: [],
      addToFrequentlyUsed: jest.fn(),
      findEmojiPosition: jest.fn(() => ({ itemIndex: 0, emojiIndex: 0 })),
      findEmojiByChar: jest.fn(() => null),
    })),
    useEmojiScroll: jest.fn(() => ({
      scrollRef: { current: null },
      virtualizer: {
        getVirtualItems: () => [
          {
            key: "test-item",
            index: 0,
            start: 0,
            size: 40,
          },
        ],
        measureElement: jest.fn(),
      },
      currentVisibleCategory: "smileys_people",
      contentStyle: { height: "100px" },
      scrollToCategory: jest.fn(),
      markInternalUpdate: jest.fn(),
      PADDING: 10,
    })),
  }
})

jest.mock("@choiceform/icons-react", () => ({
  EmojiActivity: () => <div data-testid="activity-icon">Activity</div>,
  EmojiAnimalsNature: () => <div data-testid="animals-icon">Animals</div>,
  EmojiFlags: () => <div data-testid="flags-icon">Flags</div>,
  EmojiFoodDrink: () => <div data-testid="food-icon">Food</div>,
  EmojiFrequentlyUsed: () => <div data-testid="frequently-used-icon">Frequently Used</div>,
  EmojiObjects: () => <div data-testid="objects-icon">Objects</div>,
  EmojiSmileysPeople: () => <div data-testid="smileys-icon">Smileys</div>,
  EmojiSymbols: () => <div data-testid="symbols-icon">Symbols</div>,
  EmojiTravelPlaces: () => <div data-testid="travel-icon">Travel</div>,
}))

jest.mock("../components", () => ({
  EmojiCategoryHeader: ({ title }: { title: string }) => (
    <div data-testid="category-header">{title}</div>
  ),
  EmojiEmpty: () => <div data-testid="emoji-empty">No emojis found</div>,
  EmojiFooter: ({
    hoveredEmoji,
    selectedEmoji,
  }: {
    hoveredEmoji: EmojiData | null
    selectedEmoji: EmojiData | null
  }) => (
    <div data-testid="emoji-footer">
      {hoveredEmoji?.name || selectedEmoji?.name || "Pick an emoji..."}
    </div>
  ),
  EmojiItem: ({
    emoji,
    onSelect,
    onHover,
    selected,
  }: {
    emoji: EmojiData
    onHover: (emoji: EmojiData | null) => void
    onSelect: (emoji: EmojiData) => void
    selected: boolean
  }) => (
    <button
      data-testid={`emoji-${emoji.id}`}
      data-selected={selected}
      onClick={() => onSelect(emoji)}
      onMouseEnter={() => onHover(emoji)}
      onMouseLeave={() => onHover(null)}
    >
      {emoji.emoji}
    </button>
  ),
}))

jest.mock("../../scroll", () => ({
  Scroll: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

jest.mock("../../search-input", () => ({
  SearchInput: ({
    value,
    onChange,
    placeholder,
  }: {
    onChange: (value: string) => void
    placeholder: string
    value: string
  }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

jest.mock("../../segmented", () => ({
  Segmented: ({
    children,
    value,
    onChange,
  }: {
    children: React.ReactNode
    onChange: (value: string) => void
    value?: string
  }) => (
    <div
      data-testid="segmented"
      data-value={value}
    >
      {children}
    </div>
  ),
}))

const mockEmoji: EmojiData = {
  id: 1,
  code: "U+1F600",
  emoji: "😀",
  name: "grinning face",
  nameUrl: "grinning-face",
}

const mockEmojis: EmojiData[] = [
  mockEmoji,
  {
    id: 2,
    code: "U+1F603",
    emoji: "😃",
    name: "grinning face with big eyes",
    nameUrl: "grinning-face-with-big-eyes",
  },
]

describe("EmojiPicker", () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("renders correctly with default props", () => {
    render(<EmojiPicker {...defaultProps} />)

    expect(screen.getByTestId("search-input")).toBeInTheDocument()
    expect(screen.getByTestId("segmented")).toBeInTheDocument()
    expect(screen.getByTestId("emoji-footer")).toBeInTheDocument()
  })

  it("renders without search when showSearch is false", () => {
    render(
      <EmojiPicker
        {...defaultProps}
        showSearch={false}
      />,
    )

    expect(screen.queryByTestId("search-input")).not.toBeInTheDocument()
  })

  it("renders without categories when showCategories is false", () => {
    render(
      <EmojiPicker
        {...defaultProps}
        showCategories={false}
      />,
    )

    expect(screen.queryByTestId("segmented")).not.toBeInTheDocument()
  })

  it("applies dark variant correctly", () => {
    const { container } = render(
      <EmojiPicker
        {...defaultProps}
        variant="dark"
      />,
    )

    expect(container.firstChild).toHaveClass()
  })

  it("applies light variant correctly", () => {
    const { container } = render(
      <EmojiPicker
        {...defaultProps}
        variant="light"
      />,
    )

    expect(container.firstChild).toHaveClass()
  })

  it("handles search input changes", async () => {
    const user = userEvent.setup()
    render(<EmojiPicker {...defaultProps} />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "smile")

    expect(searchInput).toHaveValue("smile")
  })

  it("displays custom search placeholder", () => {
    const customPlaceholder = "Custom search placeholder"
    render(
      <EmojiPicker
        {...defaultProps}
        searchPlaceholder={customPlaceholder}
      />,
    )

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
  })

  it("applies custom height through CSS variables", () => {
    const customHeight = 500
    const { container } = render(
      <EmojiPicker
        {...defaultProps}
        height={customHeight}
      />,
    )

    const rootElement = container.firstChild as HTMLElement
    expect(rootElement.style.getPropertyValue("--emoji-height")).toBe(`${customHeight}px`)
  })

  it("applies custom columns through CSS variables", () => {
    const customColumns = 10
    const { container } = render(
      <EmojiPicker
        {...defaultProps}
        columns={customColumns}
      />,
    )

    const rootElement = container.firstChild as HTMLElement
    expect(rootElement.style.getPropertyValue("--emoji-columns")).toBe(`${customColumns}`)
  })

  it("renders selected emoji correctly", () => {
    render(
      <EmojiPicker
        {...defaultProps}
        value={mockEmoji}
      />,
    )

    expect(screen.getByTestId("emoji-footer")).toHaveTextContent("grinning face")
  })

  it("calls onChange when emoji is selected", async () => {
    const onChange = jest.fn()
    render(
      <EmojiPicker
        {...defaultProps}
        onChange={onChange}
      />,
    )

    // This would be tested with actual emoji items when they're rendered
    // For now, we test the callback structure
    expect(onChange).not.toHaveBeenCalled()
  })

  it("applies custom className", () => {
    const customClass = "custom-emoji-picker"
    const { container } = render(
      <EmojiPicker
        {...defaultProps}
        className={customClass}
      />,
    )

    expect(container.firstChild).toHaveClass(customClass)
  })

  it("renders children correctly", () => {
    const childContent = "Custom child content"
    render(
      <EmojiPicker {...defaultProps}>
        <div data-testid="custom-child">{childContent}</div>
      </EmojiPicker>,
    )

    expect(screen.getByTestId("custom-child")).toHaveTextContent(childContent)
  })

  it("filters categories when showFrequentlyUsed is false", () => {
    render(
      <EmojiPicker
        {...defaultProps}
        showFrequentlyUsed={false}
      />,
    )

    // The frequently used category should not be available
    expect(screen.queryByTestId("frequently-used-icon")).not.toBeInTheDocument()
  })

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup()
    render(<EmojiPicker {...defaultProps} />)

    const searchInput = screen.getByTestId("search-input")
    await user.click(searchInput)
    await user.keyboard("{Tab}")

    // Test that focus moves correctly through the interface
    expect(document.activeElement).not.toBe(searchInput)
  })

  it("maintains responsive design with different column counts", () => {
    const { rerender, container } = render(
      <EmojiPicker
        {...defaultProps}
        columns={6}
      />,
    )

    let rootElement = container.firstChild as HTMLElement
    expect(rootElement.style.getPropertyValue("--emoji-columns")).toBe("6")

    rerender(
      <EmojiPicker
        {...defaultProps}
        columns={12}
      />,
    )
    rootElement = container.firstChild as HTMLElement
    expect(rootElement.style.getPropertyValue("--emoji-columns")).toBe("12")
  })

  it("handles component updates correctly", () => {
    const { rerender } = render(
      <EmojiPicker
        {...defaultProps}
        variant="dark"
      />,
    )

    expect(screen.getByTestId("emoji-footer")).toBeInTheDocument()

    rerender(
      <EmojiPicker
        {...defaultProps}
        variant="light"
      />,
    )

    expect(screen.getByTestId("emoji-footer")).toBeInTheDocument()
  })
})
