/**
 * ContextInput bug-catching tests
 *
 * BUG 1 (High): document.querySelector locates wrong listbox with multiple instances
 *   - User scenario: Two ContextInput instances on the same page. User triggers mention
 *     search in the second input and presses ArrowDown. The keyboard event is dispatched
 *     to the first instance's listbox instead of the second.
 *   - Regression it prevents: Multi-instance keyboard event cross-contamination causing
 *     wrong menu navigation or selection.
 *   - Logic change that makes it fail: In mention-menu.tsx line 72,
 *     `document.querySelector('[role="listbox"]')` always returns the first listbox in
 *     DOM order regardless of which instance is handling the event.
 *     Fix = use a scoped ref to the specific Combobox listbox element.
 *
 * BUG 2 (High): parseTextWithMentions collapses multi-paragraph content into single paragraph
 *   - User scenario: Developer passes text containing paragraph breaks (e.g., from
 *     extractTextWithMentions which inserts \n between paragraphs) to parseTextWithMentions.
 *     The returned Slate document should have multiple paragraph nodes but only one is produced.
 *   - Regression it prevents: Loss of paragraph structure when round-tripping text through
 *     extractTextWithMentions -> parseTextWithMentions.
 *   - Logic change that makes it fail: In text-extraction.ts line 108, the function always
 *     returns `[{ type: "paragraph", children }]` wrapping all content in a single paragraph.
 *     Newlines in the text are not split into separate paragraph nodes.
 *     Fix = split text on \n and create a paragraph node for each segment.
 *
 * BUG 3 (High): useMentions.handleKeyDown is dead code, keyboard selection of mentions broken
 *   - User scenario: User types @ to open the mention menu, sees multiple suggestions,
 *     presses ArrowDown to highlight the second suggestion, then presses Enter to select it.
 *     The second suggestion should be selected but the first one is selected instead
 *     (or no selection occurs at all).
 *   - Regression it prevents: Keyboard-driven mention selection silently broken — only
 *     mouse clicks can select mentions.
 *   - Logic change that makes it fail: In use-mentions.ts lines 262-303, handleKeyDown
 *     manages searchState.index for keyboard navigation. This function is returned from
 *     useMentions but never called in context-input.tsx. The component delegates to
 *     mentionMenuRef.current.handleKeyDown (MentionMenu) which dispatches a native DOM
 *     KeyboardEvent. This dispatched event may not be processed by Combobox's React event
 *     handlers when the listbox is rendered in a portal outside the React root.
 *     Fix = connect useMentions.handleKeyDown to the keyboard event chain, or ensure
 *     MentionMenu's dispatched event reliably reaches the Combobox.
 *
 * BUG 4 (Medium): renderSuggestion always receives isSelected=false
 *   - User scenario: Developer provides a custom renderSuggestion function that renders
 *     suggestions with a visual highlight when selected. The isSelected parameter is always
 *     false regardless of which suggestion is highlighted/active.
 *   - Regression it prevents: Custom suggestion items cannot display selection state,
 *     making keyboard navigation invisible to users.
 *   - Logic change that makes it fail: In mention-menu.tsx line 118,
 *     `renderSuggestion(item, false)` hardcodes false as the isSelected argument.
 *     Fix = track the active/highlighted index and pass isSelected=true for the active item.
 */
import "@testing-library/jest-dom"
import { createRef } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ContextInput } from "../context-input"
import { MentionMenu } from "../components/mention-menu"
import type { MentionMenuRef } from "../components/mention-menu"
import type { ContextMentionItemProps, ContextMentionTrigger } from "../types"
import { parseTextWithMentions } from "../utils/text-extraction"

const makeSuggestions = (): ContextMentionItemProps[] => [
  { id: "1", label: "Alice", type: "user" },
  { id: "2", label: "Bob", type: "user" },
  { id: "3", label: "Charlie", type: "user" },
]

describe("ContextInput bugs", () => {
  describe("BUG 1: MentionMenu handleKeyDown dispatches to wrong listbox with multiple instances", () => {
    it("dispatches keyboard event to the second instance's listbox, not the first in DOM", () => {
      const ref1 = createRef<MentionMenuRef>()
      const ref2 = createRef<MentionMenuRef>()
      const suggestions = makeSuggestions()

      render(
        <>
          <MentionMenu
            ref={ref1}
            isOpen={true}
            loading={false}
            position={{ x: 0, y: 0 }}
            suggestions={suggestions}
            onClose={() => {}}
            onSelect={() => {}}
          />
          <MentionMenu
            ref={ref2}
            isOpen={true}
            loading={false}
            position={{ x: 100, y: 100 }}
            suggestions={suggestions}
            onClose={() => {}}
            onSelect={() => {}}
          />
        </>,
      )

      const listboxes = document.querySelectorAll('[role="listbox"]')
      expect(listboxes.length).toBeGreaterThanOrEqual(2)

      const firstListener = vi.fn()
      const secondListener = vi.fn()
      listboxes[0].addEventListener("keydown", firstListener)
      listboxes[1].addEventListener("keydown", secondListener)

      const keyboardEvent = {
        key: "ArrowDown",
        code: "ArrowDown",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as React.KeyboardEvent

      ref2.current?.handleKeyDown(keyboardEvent)

      expect(secondListener).toHaveBeenCalled()
      expect(firstListener).not.toHaveBeenCalled()
    })
  })

  describe("BUG 2: parseTextWithMentions must preserve paragraph structure", () => {
    it("creates separate paragraph nodes for text with newline separators", () => {
      const result = parseTextWithMentions("First paragraph\nSecond paragraph", [])

      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty("type", "paragraph")
      expect(result[1]).toHaveProperty("type", "paragraph")
    })
  })

  describe("BUG 3: keyboard selection of mentions must work", () => {
    it("selects the second suggestion after ArrowDown then Enter", async () => {
      const onMentionSelect = vi.fn()
      const user = userEvent.setup()

      const trigger: ContextMentionTrigger = {
        char: "@",
        onSearch: () => Promise.resolve(makeSuggestions()),
      }

      render(
        <ContextInput
          triggers={[trigger]}
          onMentionSelect={onMentionSelect}
        />,
      )

      const editor = screen.getByRole("textbox")
      await user.click(editor)
      for (const char of "@ali") {
        await user.type(editor, char)
      }

      await waitFor(
        () => {
          const items = document.querySelectorAll('[role="menuitem"]')
          expect(items.length).toBeGreaterThan(0)
        },
        { timeout: 3000 },
      )

      await user.keyboard("{ArrowDown}")
      await user.keyboard("{Enter}")

      expect(onMentionSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "2" }), "@")
    })
  })

  describe("BUG 4: renderSuggestion must receive isSelected=true for highlighted item", () => {
    it("passes isSelected=true to at least one suggestion when menu is open", () => {
      const renderSuggestion = vi.fn((item: ContextMentionItemProps, isSelected: boolean) => (
        <span data-selected={isSelected}>{item.label}</span>
      ))

      render(
        <MentionMenu
          isOpen={true}
          loading={false}
          position={{ x: 0, y: 0 }}
          suggestions={makeSuggestions()}
          onClose={() => {}}
          onSelect={() => {}}
          renderSuggestion={renderSuggestion}
        />,
      )

      const anySelected = renderSuggestion.mock.calls.some(([, isSelected]) => isSelected === true)
      expect(anySelected).toBe(true)
    })
  })
})
