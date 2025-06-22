import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { EmojiItem } from "../components/emoji-item"
import type { EmojiData } from "../hooks"

// Mock the TV styles
jest.mock("../tv", () => ({
  emojiItemTv: jest.fn(
    ({ variant, selected }) => `emoji-item ${variant} ${selected ? "selected" : ""}`,
  ),
}))

const mockEmoji: EmojiData = {
  id: 1,
  code: "U+1F600",
  emoji: "😀",
  name: "grinning face",
  nameUrl: "grinning-face",
}

describe("EmojiItem", () => {
  let mockOnSelect: jest.Mock
  let mockOnHover: jest.Mock
  let defaultProps: {
    emoji: EmojiData
    onHover: jest.Mock
    onSelect: jest.Mock
  }

  beforeEach(() => {
    mockOnSelect = jest.fn()
    mockOnHover = jest.fn()
    defaultProps = {
      emoji: mockEmoji,
      onSelect: mockOnSelect,
      onHover: mockOnHover,
    }
    jest.clearAllMocks()
  })

  it("renders emoji correctly", () => {
    render(<EmojiItem {...defaultProps} />)

    expect(screen.getByText("😀")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("displays correct title attribute", () => {
    render(<EmojiItem {...defaultProps} />)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("title", "grinning face (😀)")
  })

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup()

    render(<EmojiItem {...defaultProps} />)

    await user.click(screen.getByRole("button"))

    expect(mockOnSelect).toHaveBeenCalledTimes(1)
    expect(mockOnSelect).toHaveBeenCalledWith(mockEmoji)
  })

  it("calls onHover when mouse enters", () => {
    render(<EmojiItem {...defaultProps} />)

    fireEvent.mouseEnter(screen.getByRole("button"))

    expect(mockOnHover).toHaveBeenCalledTimes(1)
    expect(mockOnHover).toHaveBeenCalledWith(mockEmoji)
  })

  it("calls onHover with null when mouse leaves", () => {
    render(<EmojiItem {...defaultProps} />)

    fireEvent.mouseLeave(screen.getByRole("button"))

    expect(mockOnHover).toHaveBeenCalledTimes(1)
    expect(mockOnHover).toHaveBeenCalledWith(null)
  })

  it("does not call onHover when it's undefined", () => {
    // Should not throw error when onHover is undefined
    render(
      <EmojiItem
        emoji={mockEmoji}
        onSelect={jest.fn()}
      />,
    )

    const button = screen.getByRole("button")

    expect(() => {
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
    }).not.toThrow()
  })

  it("applies selected state correctly", () => {
    const { container } = render(
      <EmojiItem
        {...defaultProps}
        selected={true}
      />,
    )

    expect(container.firstChild).toHaveClass("emoji-item", "dark", "selected")
  })

  it("applies dark variant by default", () => {
    const { container } = render(<EmojiItem {...defaultProps} />)

    expect(container.firstChild).toHaveClass("emoji-item", "dark")
  })

  it("applies light variant correctly", () => {
    const { container } = render(
      <EmojiItem
        {...defaultProps}
        variant="light"
      />,
    )

    expect(container.firstChild).toHaveClass("emoji-item", "light")
  })

  it("handles keyboard interactions", async () => {
    const user = userEvent.setup()

    render(<EmojiItem {...defaultProps} />)

    const button = screen.getByRole("button")

    // Focus the button
    await user.tab()
    expect(button).toHaveFocus()

    // Press Enter
    await user.keyboard("{Enter}")
    expect(mockOnSelect).toHaveBeenCalledWith(mockEmoji)

    // Press Space
    await user.keyboard(" ")
    expect(mockOnSelect).toHaveBeenCalledTimes(2)
  })

  it("handles rapid mouse events", () => {
    render(<EmojiItem {...defaultProps} />)

    const button = screen.getByRole("button")

    // Rapid mouse enter/leave events
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)

    expect(mockOnHover).toHaveBeenCalledTimes(4)
    expect(mockOnHover).toHaveBeenNthCalledWith(1, mockEmoji)
    expect(mockOnHover).toHaveBeenNthCalledWith(2, null)
    expect(mockOnHover).toHaveBeenNthCalledWith(3, mockEmoji)
    expect(mockOnHover).toHaveBeenNthCalledWith(4, null)
  })

  it("handles emoji with complex unicode characters", () => {
    const complexEmoji: EmojiData = {
      id: 2,
      code: "U+1F468 U+200D U+1F4BB",
      emoji: "👨‍💻",
      name: "man technologist",
      nameUrl: "man-technologist",
    }

    render(
      <EmojiItem
        {...defaultProps}
        emoji={complexEmoji}
      />,
    )

    expect(screen.getByText("👨‍💻")).toBeInTheDocument()
    expect(screen.getByRole("button")).toHaveAttribute("title", "man technologist (👨‍💻)")
  })

  it("handles multiple clicks without issues", async () => {
    const user = userEvent.setup()

    render(<EmojiItem {...defaultProps} />)

    const button = screen.getByRole("button")

    // Multiple rapid clicks
    await user.click(button)
    await user.click(button)
    await user.click(button)

    expect(mockOnSelect).toHaveBeenCalledTimes(3)
    expect(mockOnSelect).toHaveBeenCalledWith(mockEmoji)
  })

  it("maintains accessibility attributes", () => {
    render(<EmojiItem {...defaultProps} />)

    const button = screen.getByRole("button")

    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveAttribute("title")
  })

  it("is memoized correctly", () => {
    const { rerender } = render(<EmojiItem {...defaultProps} />)

    const button1 = screen.getByRole("button")

    // Rerender with same props
    rerender(<EmojiItem {...defaultProps} />)

    const button2 = screen.getByRole("button")

    // Since component is memoized, button should be the same
    expect(button1).toBe(button2)
  })

  it("updates when props change", () => {
    const { rerender } = render(
      <EmojiItem
        {...defaultProps}
        selected={false}
      />,
    )

    expect(screen.getByRole("button")).not.toHaveClass("selected")

    rerender(
      <EmojiItem
        {...defaultProps}
        selected={true}
      />,
    )

    expect(screen.getByRole("button")).toHaveClass("selected")
  })

  it("handles long emoji names in title", () => {
    const longNameEmoji: EmojiData = {
      id: 3,
      code: "U+1F469",
      emoji: "👩‍🚀",
      name: "woman astronaut with very very very long descriptive name",
      nameUrl: "woman-astronaut",
    }

    render(
      <EmojiItem
        {...defaultProps}
        emoji={longNameEmoji}
      />,
    )

    expect(screen.getByRole("button")).toHaveAttribute(
      "title",
      "woman astronaut with very very very long descriptive name (👩‍🚀)",
    )
  })
})
