import React from "react"
import { render, screen } from "@testing-library/react"
import { EmojiFooter } from "../components/emoji-footer"
import type { EmojiData } from "../hooks"

// Mock the TV styles
jest.mock("../tv", () => ({
  emojiFooterTv: jest.fn(() => ({
    footer: () => "footer-class",
    emojiPreview: () => "emoji-preview-class",
    emojiPreviewEmpty: () => "emoji-preview-empty-class",
    emojiInfo: () => "emoji-info-class",
    emojiName: () => "emoji-name-class",
    emojiCode: () => "emoji-code-class",
  })),
}))

const mockEmoji: EmojiData = {
  id: 1,
  code: "U+1F600",
  emoji: "😀",
  name: "grinning face",
  nameUrl: "grinning-face",
}

const mockSelectedEmoji: EmojiData = {
  id: 2,
  code: "U+1F603",
  emoji: "😃",
  name: "grinning face with big eyes",
  nameUrl: "grinning-face-with-big-eyes",
}

describe("EmojiFooter", () => {
  it("renders default message when no emoji is provided", () => {
    render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("Pick an emoji...")).toBeInTheDocument()
  })

  it("displays hovered emoji when provided", () => {
    render(
      <EmojiFooter
        hoveredEmoji={mockEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("😀")).toBeInTheDocument()
    expect(screen.getByText("grinning face")).toBeInTheDocument()
    expect(screen.getByText(":grinning-face:")).toBeInTheDocument()
  })

  it("displays selected emoji when no hovered emoji", () => {
    render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={mockSelectedEmoji}
      />,
    )

    expect(screen.getByText("😃")).toBeInTheDocument()
    expect(screen.getByText("grinning face with big eyes")).toBeInTheDocument()
    expect(screen.getByText(":grinning-face-with-big-eyes:")).toBeInTheDocument()
  })

  it("prioritizes hovered emoji over selected emoji", () => {
    render(
      <EmojiFooter
        hoveredEmoji={mockEmoji}
        selectedEmoji={mockSelectedEmoji}
      />,
    )

    // Should show hovered emoji (😀) not selected emoji (😃)
    expect(screen.getByText("😀")).toBeInTheDocument()
    expect(screen.getByText("grinning face")).toBeInTheDocument()
    expect(screen.getByText(":grinning-face:")).toBeInTheDocument()

    // Should not show selected emoji details
    expect(screen.queryByText("😃")).not.toBeInTheDocument()
    expect(screen.queryByText("grinning face with big eyes")).not.toBeInTheDocument()
  })

  it("applies dark variant correctly", () => {
    const { container } = render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={null}
        variant="dark"
      />,
    )

    expect(container.querySelector(".footer-class")).toBeInTheDocument()
  })

  it("applies light variant correctly", () => {
    const { container } = render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={null}
        variant="light"
      />,
    )

    expect(container.querySelector(".footer-class")).toBeInTheDocument()
  })

  it("does not show emoji code when no emoji is provided", () => {
    render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={null}
      />,
    )

    expect(screen.queryByText(/:.*:/)).not.toBeInTheDocument()
  })

  it("shows empty preview element when no emoji is provided", () => {
    const { container } = render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={null}
      />,
    )

    expect(container.querySelector(".emoji-preview-empty-class")).toBeInTheDocument()
  })

  it("handles emoji with special characters in nameUrl", () => {
    const specialEmoji: EmojiData = {
      id: 3,
      code: "U+1F92A",
      emoji: "🤪",
      name: "zany face",
      nameUrl: "zany-face",
    }

    render(
      <EmojiFooter
        hoveredEmoji={specialEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("🤪")).toBeInTheDocument()
    expect(screen.getByText("zany face")).toBeInTheDocument()
    expect(screen.getByText(":zany-face:")).toBeInTheDocument()
  })

  it("handles very long emoji names", () => {
    const longNameEmoji: EmojiData = {
      id: 4,
      code: "U+1F468",
      emoji: "👨‍💻",
      name: "man technologist with very long descriptive name",
      nameUrl: "man-technologist-with-very-long-descriptive-name",
    }

    render(
      <EmojiFooter
        hoveredEmoji={longNameEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("👨‍💻")).toBeInTheDocument()
    expect(screen.getByText("man technologist with very long descriptive name")).toBeInTheDocument()
    expect(
      screen.getByText(":man-technologist-with-very-long-descriptive-name:"),
    ).toBeInTheDocument()
  })

  it("updates when hoveredEmoji changes", () => {
    const { rerender } = render(
      <EmojiFooter
        hoveredEmoji={mockEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("😀")).toBeInTheDocument()

    rerender(
      <EmojiFooter
        hoveredEmoji={mockSelectedEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("😃")).toBeInTheDocument()
    expect(screen.queryByText("😀")).not.toBeInTheDocument()
  })

  it("updates when selectedEmoji changes", () => {
    const { rerender } = render(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={mockEmoji}
      />,
    )

    expect(screen.getByText("😀")).toBeInTheDocument()

    rerender(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={mockSelectedEmoji}
      />,
    )

    expect(screen.getByText("😃")).toBeInTheDocument()
    expect(screen.queryByText("😀")).not.toBeInTheDocument()
  })

  it("handles transition from emoji to no emoji", () => {
    const { rerender } = render(
      <EmojiFooter
        hoveredEmoji={mockEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("😀")).toBeInTheDocument()
    expect(screen.getByText("grinning face")).toBeInTheDocument()

    rerender(
      <EmojiFooter
        hoveredEmoji={null}
        selectedEmoji={null}
      />,
    )

    expect(screen.queryByText("😀")).not.toBeInTheDocument()
    expect(screen.queryByText("grinning face")).not.toBeInTheDocument()
    expect(screen.getByText("Pick an emoji...")).toBeInTheDocument()
  })

  it("handles emoji with empty or undefined properties gracefully", () => {
    const incompleteEmoji = {
      id: 5,
      code: "U+1F600",
      emoji: "😀",
      name: "",
      nameUrl: "",
    } as EmojiData

    render(
      <EmojiFooter
        hoveredEmoji={incompleteEmoji}
        selectedEmoji={null}
      />,
    )

    expect(screen.getByText("😀")).toBeInTheDocument()
    expect(screen.getByText("::")).toBeInTheDocument() // Empty nameUrl should still show colons
  })
})
