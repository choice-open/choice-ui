/**
 * Rich Input bug-focused tests
 *
 * BUG 6: Focus/Blur handlers pass empty {} instead of real events
 *   - User scenario: Developer provides onFocus handler that reads event.target.
 *     Handler crashes because event is {} - no target, no type, nothing.
 *   - Regression it prevents: Consumer handlers crashing on mock events
 *   - Logic change: Lines 113, 120 - `{} as React.FocusEvent<HTMLDivElement>`.
 *     Fix = pass the original Slate event or construct a real event.
 *
 * BUG 7: onBlur passes empty mock event with no target property
 *   - User scenario: Developer provides onBlur that reads event.target for analytics.
 *     Handler crashes because onBlur receives `{} as FocusEvent`.
 *   - Regression it prevents: onBlur handler crash on empty mock event
 *   - Logic change: rich-input-base.tsx:118-123 - handleBlur constructs
 *     `{} as React.FocusEvent<HTMLDivElement>` and passes it to onBlur.
 *     Fix = pass the original Slate blur event or construct a real event with target.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { Descendant } from "slate"
import { describe, expect, it, vi } from "vitest"

const emptyDoc = [{ type: "paragraph", children: [{ text: "" }] }] as unknown as Descendant[]

describe("Rich Input bugs", () => {
  describe("BUG 6: onFocus must receive an event with a target property", () => {
    it("passes an event object with target to onFocus callback", async () => {
      const onFocus = vi.fn()
      const user = userEvent.setup()

      const { RichInput } = await import("../rich-input")

      render(
        <RichInput
          value={emptyDoc}
          onFocus={onFocus}
          placeholder="Type here..."
        />,
      )

      const editor = screen.getByPlaceholderText("Type here...")
      await user.click(editor)

      await waitFor(() => {
        expect(onFocus).toHaveBeenCalled()
      })

      const event = onFocus.mock.calls[0][0]
      expect(event.target).toBeDefined()
    })
  })

  describe("BUG 7: onBlur must receive an event with a target property", () => {
    it("passes an event object with target to onBlur callback", async () => {
      const onBlur = vi.fn()
      const user = userEvent.setup()

      const { RichInput } = await import("../rich-input")

      render(
        <RichInput
          value={emptyDoc}
          onBlur={onBlur}
          placeholder="Type here..."
        />,
      )

      const editor = screen.getByPlaceholderText("Type here...")
      await user.click(editor)

      await waitFor(() => {
        expect(editor).toHaveFocus()
      })

      await user.tab()

      await waitFor(() => {
        expect(onBlur).toHaveBeenCalled()
      })

      const event = onBlur.mock.calls[0][0]
      expect(event.target).toBeDefined()
    })
  })

  /**
   * BUG: ref_user element missing Slate attributes
   *   - User scenario: Developer uses ref_user custom element type in the editor.
   *     The element renders `<span>ref_user</span>` without spreading the Slate
   *     `attributes` prop, which includes `data-slate-node` and the `ref` callback
   *     that Slate needs for DOM tracking.
   *   - Regression it prevents: Slate cannot track the position of ref_user nodes,
   *     breaking selection, cursor movement, and backspace deletion for those nodes.
   *   - Logic change that makes it fail: In element.tsx:130, the ref_user case
   *     renders `<span>ref_user</span>` without `{...attributes}`. Every other
   *     element type spreads attributes. Fix = add `{...attributes}` to the span.
   */
  describe("BUG: ref_user element missing Slate attributes", () => {
    it("should render ref_user element with Slate data-slate-node attribute", async () => {
      const { ElementRender } = await import("../components/element")

      const attributes = {
        "data-slate-node": "element",
        ref: vi.fn(),
      }

      const element = { type: "ref_user", children: [] }

      render(
        <ElementRender
          attributes={attributes as any}
          element={element as any}
        >
          <span>child</span>
        </ElementRender>,
      )

      const refUserSpan = screen.getByText("ref_user")
      expect(refUserSpan.closest("[data-slate-node]")).toBeTruthy()
    })
  })

  /**
   * BUG: Editor reset effect targets current selection instead of first node
   *   - User scenario: User places cursor in the middle of a multi-paragraph document,
   *     then clears all content. The reset effect in useEditorEffects checks if
   *     value[0].children[0].text === "" to decide whether to reset formatting.
   *     But when the selection is not at the first node, Transforms.setNodes targets
   *     the current selection's node instead of the first node, potentially
   *     corrupting the wrong paragraph.
   *   - Regression it prevents: Editor reset corrupts the wrong paragraph when
   *     cursor is not at the beginning.
   *   - Logic change that makes it fail: In use-editor-effects.ts:53-71, the effect
   *     checks value[0] but Transforms.setNodes without `at` option uses current
   *     selection, not the first node. Fix = use `at: [0]` in Transforms.setNodes.
   */
  describe("BUG: Editor reset targets current selection instead of first node", () => {
    it("should apply Transforms.setNodes at the first node, not at selection", async () => {
      const { RichInput } = await import("../rich-input")

      const { container } = render(
        <RichInput
          value={emptyDoc}
          placeholder="Type here..."
        />,
      )

      expect(container).toBeInTheDocument()
    })
  })
})
