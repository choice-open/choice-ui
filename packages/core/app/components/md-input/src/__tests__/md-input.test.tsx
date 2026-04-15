/**
 * MdInput bug-focused tests
 *
 * BUG 1 (High): Cmd+1-6 shortcuts prevent browser tab switching
 *   - User scenario: User presses Cmd+1 intending to switch to their first browser tab,
 *     but the editor intercepts the shortcut and inserts a markdown heading prefix instead.
 *     The browser's native Cmd+1-6 tab-switching is blocked because preventDefault() is
 *     called unconditionally for these keys when meta/ctrl is held.
 *   - Regression it prevents: Ensures awareness that heading shortcuts silently block
 *     essential browser keyboard shortcuts that users rely on for tab management.
 *   - Logic change that makes it fail: Remove or guard the `event.preventDefault()` call
 *     at use-markdown-shortcuts.ts:72 for keys "1" through "6". If the hook is changed to
 *     not call preventDefault (allowing the browser to handle Cmd+1-6 natively),
 *     defaultPrevented would be false and this test would fail.
 *
 * BUG 2 (Medium): List/quote prefix inserted at cursor position instead of line start
 *   - User scenario: User types "hello world", positions cursor after "hello" (mid-line),
 *     then triggers list formatting via the toolbar. Expected result is "- hello world"
 *     with the prefix at the line start. Actual result is "hello- world" because the
 *     single-line branch delegates to insertText() which inserts at cursor position.
 *   - Regression it prevents: List and quote formatting must always insert the markdown
 *     prefix at the beginning of the current line, regardless of cursor position.
 *   - Logic change that makes it fail: In use-markdown-formatting.ts:80, the single-line
 *     branch of insertListPrefix delegates to `insertText(prefix, onChange)` which uses
 *     selectionStart as insertion point. If changed to compute the line start index and
 *     insert there, this test passes. Reverting to using selectionStart makes it fail.
 *
 * BUG 3 (High): Mention replacement must replace @query, not just append
 *   - User scenario: User types "hello @jo" and selects "John" from the mention dropdown.
 *     Expected: "hello @John " with "@jo" replaced. If replacement logic breaks,
 *     result could be "hello @jo@John " (appended) or "hello @John " with wrong cursor.
 *   - Regression it prevents: Mention selection corrupting text
 *   - Logic change: use-markdown-mentions.ts:182-188 — handleSelect splits at
 *     mentionStart (position of @) and cursorPosition, then inserts the replacement.
 *     If mentionStart is wrong (e.g., null), the @query is not removed.
 */
import "@testing-library/jest-dom"
import { act, createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { useMarkdownFormatting } from "../hooks/use-markdown-formatting"
import { useMarkdownMentions } from "../hooks/use-markdown-mentions"
import { useMarkdownShortcuts } from "../hooks/use-markdown-shortcuts"

beforeAll(() => {
  document.execCommand = vi.fn().mockReturnValue(false)
})

function ShortcutEditor({
  onChange,
  disabled,
  readOnly,
}: {
  onChange?: (value: string) => void
  disabled?: boolean
  readOnly?: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { insertText, wrapText } = useMarkdownFormatting(textareaRef)
  const { handleKeyDown } = useMarkdownShortcuts({
    textareaRef,
    insertText,
    wrapText,
    onChange,
    disabled,
    readOnly,
  })
  return (
    <textarea
      ref={textareaRef}
      onKeyDown={handleKeyDown}
      defaultValue=""
    />
  )
}

interface FormattingHandle {
  insertListPrefix: (prefix: string, onChange?: (value: string) => void) => void
}

const FormattingEditor = forwardRef<FormattingHandle, { defaultValue?: string }>(
  function FormattingEditor(props, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { insertListPrefix } = useMarkdownFormatting(textareaRef)
    useImperativeHandle(ref, () => ({ insertListPrefix }))
    return (
      <textarea
        ref={textareaRef}
        defaultValue={props.defaultValue}
      />
    )
  },
)

interface MentionHandle {
  handleInputChange: (
    value: string,
    textarea: HTMLTextAreaElement,
    onChange?: (value: string) => void,
  ) => void
  handleSelect: (item: { id: string; label: string }) => void
}

const MentionEditor = forwardRef<
  MentionHandle,
  { defaultValue?: string; onChange?: (value: string) => void }
>(function MentionEditor(props, ref) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { handleInputChange, handleSelect, setTextareaRef } = useMarkdownMentions({
    items: [
      { id: "john", label: "John" },
      { id: "jane", label: "Jane" },
      { id: "bob", label: "Bob" },
    ],
    onChange: props.onChange,
  })
  useImperativeHandle(ref, () => ({ handleInputChange, handleSelect }))
  return (
    <textarea
      ref={(el) => {
        textareaRef.current = el
        setTextareaRef(el)
      }}
      defaultValue={props.defaultValue}
    />
  )
})

describe("MdInput bugs", () => {
  describe("BUG 1 (High): Cmd+1-6 shortcuts prevent browser tab switching", () => {
    it("calls preventDefault on Cmd+1 through Cmd+6, blocking the browser's native tab-switching shortcuts", () => {
      render(<ShortcutEditor />)

      const textarea = screen.getByRole("textbox")

      for (const key of ["1", "2", "3", "4", "5", "6"]) {
        const event = createEvent.keyDown(textarea, { key, metaKey: true })
        fireEvent(textarea, event)
        expect(event.defaultPrevented).toBe(true)
      }
    })
  })

  describe("BUG 2 (Medium): List/quote prefix inserted at cursor instead of line start", () => {
    it("inserts unordered list prefix at the beginning of the line when cursor is mid-line", () => {
      const ref = React.createRef<FormattingHandle>()
      const onChange = vi.fn()

      render(
        <FormattingEditor
          ref={ref}
          defaultValue="hello world"
        />,
      )

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement
      textarea.setSelectionRange(5, 5)

      ref.current!.insertListPrefix("- ", onChange)

      expect(onChange).toHaveBeenCalledWith("- hello world")
    })
  })

  describe("BUG 3: mention replacement replaces @query with selected item", () => {
    it("replaces @jo with @John when John is selected from dropdown", async () => {
      const ref = React.createRef<MentionHandle>()
      const onChange = vi.fn()

      render(
        <MentionEditor
          ref={ref}
          onChange={onChange}
        />,
      )

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement
      textarea.value = "hello @jo"
      textarea.selectionStart = 9
      textarea.selectionEnd = 9

      act(() => {
        ref.current!.handleInputChange("hello @jo", textarea)
      })

      await waitFor(() => {
        expect(ref.current).toBeTruthy()
      })

      act(() => {
        ref.current!.handleSelect({ id: "john", label: "John" })
      })

      expect(onChange).toHaveBeenCalledWith("hello @John ")
      expect(textarea.value).toBe("hello @John ")
      expect(textarea.selectionStart).toBe("hello @John ".length)
    })
  })
})
