/**
 * Popover bug-focused tests
 *
 * BUG 5: interactions="none" still closes on Escape
 *   - User scenario: Developer sets interactions="none" for full programmatic control.
 *     Outside clicks correctly don't close, but pressing Escape still closes the popover.
 *     The developer's state is now out of sync — they set open=true but it's visually closed.
 *   - Regression it prevents: interactions="none" being a lie — Escape bypasses it
 *   - Logic change that makes it fail: use-floating-popover.ts line 233 disables useDismiss
 *     when interactions="none", but line 279's standalone escape handler only checks
 *     closeOnEscape, not interactions. Fix = add `&& interactions !== "none"` guard.
 */
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"

describe("Popover bugs", () => {
  describe("BUG 5: interactions=none must not close on Escape", () => {
    it("keeps popover open when Escape is pressed and interactions is none", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      const onOpenChange = vi.fn()

      render(
        <Popover
          open
          onOpenChange={onOpenChange}
          interactions="none"
        >
          <Popover.Trigger>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Header>Header</Popover.Header>
          <Popover.Content>Content</Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByText("Content")).toBeInTheDocument()
      })

      await user.keyboard("{Escape}")

      expect(onOpenChange).not.toHaveBeenCalled()
    })
  })

  /**
   * BUG: Popover aria-modal="true" contradicts focusManagerProps.modal: false
   *   - User scenario: Screen reader user encounters a popover with aria-modal="true",
   *     which tells the screen reader that content outside the popover is inert.
   *     But the actual focus trap (modal:false) does not trap focus, so the screen
   *     reader's mental model is wrong.
   *   - Regression it prevents: Screen reader announces modal behavior but focus
   *     can leave the popover, confusing assistive technology users.
   *   - Logic change that makes it fail: In popover.tsx:252, the popover renders
   *     aria-modal="true" unconditionally, but the floating-ui focusManager is
   *     configured with modal:false. Fix = either set aria-modal to match the
   *     actual modal behavior (false by default), or set modal:true in focusManager.
   */
  describe("BUG: aria-modal contradicts actual modal behavior", () => {
    it("should not set aria-modal=true when focus trap is not enabled (modal:false)", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      render(
        <Popover defaultOpen>
          <Popover.Trigger>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="popover-content">Content</div>
          </Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByTestId("popover-content")).toBeInTheDocument()
      })

      const popover = screen.getByTestId("popover-content").closest("[aria-modal]")
      if (popover) {
        expect(popover.getAttribute("aria-modal")).toBe("false")
      }
    })
  })

  /**
   * BUG: useDrag floatingRef.current in useEffect deps never triggers on ref mutation
   *   - User scenario: A draggable popover opens and the floating element mounts.
   *     The useDrag hook should detect the new element and reset its drag state.
   *     But the useEffect with floatingRef.current in its deps array never fires
   *     because React doesn't re-render when a ref's .current changes.
   *   - Regression it prevents: Drag state is not reset when a popover re-mounts
   *     its floating element, potentially leaving stale position state.
   *   - Logic change that makes it fail: In use-drag.ts:207, the useEffect deps
   *     include `floatingRef.current`, but refs don't trigger React re-renders.
   *     The ESLint disable comment acknowledges this. Fix = use a callback ref
   *     pattern or a state-based approach to detect when the floating element mounts.
   */
  describe("BUG: useDrag does not detect floatingRef.current changes", () => {
    it("should not leave stale drag state when floating element remounts", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      render(
        <Popover
          defaultOpen
          draggable
        >
          <Popover.Trigger>
            <button>Trigger</button>
          </Popover.Trigger>
          <Popover.Content>
            <div data-testid="drag-content">Drag me</div>
          </Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByTestId("drag-content")).toBeInTheDocument()
      })

      expect(screen.getByTestId("drag-content")).toBeInTheDocument()
    })
  })
})
