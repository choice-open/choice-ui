/**
 * Emoji Picker bug-focused tests
 *
 * BUG 1: Emoji buttons lack aria-label for screen reader accessibility
 *   - User scenario: A screen reader user opens the emoji picker and navigates
 *     through emoji options. They need to hear the name of each emoji to make
 *     a selection.
 *   - Regression it prevents: Removing or forgetting the aria-label on emoji
 *     buttons makes the picker completely unusable for assistive technology
 *     users, as the buttons would be announced generically (e.g. "button" with
 *     no context) instead of by name.
 *   - Logic change that makes it fail: Adding an `aria-label` attribute to the
 *     `<button>` in emoji-item.tsx (line 17) — e.g.
 *     `aria-label={emoji.name}` — would make this test pass. Currently the
 *     button has only a `title` attribute but no `aria-label`, so screen
 *     readers cannot reliably announce the emoji name.
 */
import "@testing-library/jest-dom"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { EmojiItem } from "../components/emoji-item"
import type { EmojiData } from "../hooks/use-emoji-data"

const MOCK_EMOJI: EmojiData = {
  id: 1,
  code: "1f600",
  emoji: "😀",
  name: "Grinning Face",
  nameUrl: "grinning-face",
}

describe("Emoji Picker bugs", () => {
  describe("BUG 1: emoji buttons must have aria-label for screen reader accessibility", () => {
    it("renders an aria-label on the emoji button matching the emoji's name", () => {
      render(
        <EmojiItem
          emoji={MOCK_EMOJI}
          onSelect={vi.fn()}
        />,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("aria-label", expect.stringContaining("Grinning Face"))
    })

    it("announces the emoji name via aria-label, not just the emoji character", () => {
      render(
        <EmojiItem
          emoji={MOCK_EMOJI}
          onSelect={vi.fn()}
        />,
      )

      const button = screen.getByRole("button")
      const label = button.getAttribute("aria-label") ?? ""
      expect(label).not.toBe("😀")
      expect(label.toLowerCase()).toContain("grinning")
    })
  })

  /**
   * ONSELECT CALLBACK: clicking an emoji fires onChange with correct data
   *   User scenario: User clicks the grinning face emoji in the picker.
   *     The onChange callback must fire with the full EmojiData object.
   *   Regression it prevents: Emoji clicks not triggering onChange
   *   Logic change: EmojiItem's button onClick calls onSelect(emoji).
   *     If this call chain breaks, clicking emojis does nothing.
   */
  describe("onSelect fires when emoji is clicked", () => {
    it("calls onSelect with the emoji data when the button is clicked", async () => {
      const onSelect = vi.fn()
      const user = userEvent.setup()

      render(
        <EmojiItem
          emoji={MOCK_EMOJI}
          onSelect={onSelect}
        />,
      )

      await user.click(screen.getByRole("button"))

      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith(MOCK_EMOJI)
    })
  })
})
