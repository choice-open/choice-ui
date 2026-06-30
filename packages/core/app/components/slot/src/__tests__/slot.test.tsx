/**
 * Slot bug-focused tests
 *
 * BUG 1: Slot fallback props must not override child-authored props
 *   User scenario: Developer renders <Slot disabled={false}><button disabled /></Slot>.
 *   The child-authored disabled state must win so composed controls cannot be
 *   accidentally re-enabled by parent Slot props.
 *   Regression it prevents: Slot props overriding child-owned id, type, aria-*,
 *   disabled, or data-* props.
 *   Logic change: slot.tsx mergeProps prefers child props for overlapping
 *   non-handler props and uses Slot props only as fallback.
 *
 * BUG 2: Slot must handle event handlers when cloning child
 *   User scenario: Slot wraps a button with onClick. Both slot and child onClick should fire.
 *   Regression it prevents: Event handlers not properly merged
 *
 * BUG 3: Style objects must merge with child winning conflicts, slot preserving unique props
 *   User scenario: Developer renders <Slot style={{ padding: 8, margin: 4 }}>
 *     <button style={{ padding: 16 }}>Click</button></Slot>.
 *     The button should have margin:4 (from slot, not overridden) and padding:16 (child wins).
 *   Regression it prevents: Child styles completely replacing slot styles during merge
 *   Logic change: slot.tsx:84 — `{ ...(slotPropValue as object), ...(childPropValue as object) }`
 *     spreads slot first then child, so child wins conflicts. If changed to simple assignment,
 *     all slot styles are lost.
 *
 * BUG 4: composeRefs must call both forwarded ref and child's original ref
 *   User scenario: Parent passes ref to Slot, child also has ref. Both refs must resolve
 *     to the same DOM node.
 *   Regression it prevents: Parent losing access to DOM node or child's internal ref breaking
 *   Logic change: slot.tsx:100-110 — composeRefs iterates all refs. If loop breaks or a ref
 *     is dropped, one party loses DOM access.
 */
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { Slot } from "../slot"

describe("Slot bugs", () => {
  describe("BUG 1: child-authored non-event props must win over slot fallback props", () => {
    it("uses slot props as fallback when the child does not define them", () => {
      render(
        <Slot data-testid="slot-test-id">
          <button>Click</button>
        </Slot>,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("data-testid", "slot-test-id")
    })

    it("preserves child props when slot and child define the same non-event prop", () => {
      render(
        <Slot
          aria-label="slot label"
          data-testid="slot-test-id"
          id="slot-id"
        >
          <button
            aria-label="child label"
            data-testid="child-test-id"
            disabled
            id="child-id"
            type="button"
          >
            Click
          </button>
        </Slot>,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("aria-label", "child label")
      expect(button).toHaveAttribute("data-testid", "child-test-id")
      expect(button).toHaveAttribute("id", "child-id")
      expect(button).toHaveAttribute("type", "button")
      expect(button).toBeDisabled()
    })
  })

  describe("BUG 2: Slot must handle event handlers when cloning child", () => {
    it("fires both slot and child onClick handlers when child element exists", () => {
      const slotClick = vi.fn()
      const childClick = vi.fn()

      render(
        <Slot onClick={slotClick}>
          <button onClick={childClick}>Click</button>
        </Slot>,
      )

      fireEvent.click(screen.getByRole("button"))
      expect(slotClick).toHaveBeenCalled()
      expect(childClick).toHaveBeenCalled()
    })
  })

  describe("BUG 3: style objects must merge with child winning conflicts", () => {
    it("preserves slot-only styles while child overrides conflicting ones", () => {
      render(
        <Slot style={{ padding: 8, margin: 4 } as React.CSSProperties}>
          <button style={{ padding: 16 }}>Click</button>
        </Slot>,
      )

      const button = screen.getByRole("button")
      const style = button.style
      expect(style.margin).toBe("4px")
      expect(style.padding).toBe("16px")
    })
  })

  describe("BUG 4: composeRefs must call both forwarded ref and child ref", () => {
    it("both refs point to the same DOM node after mount", () => {
      const parentRef = React.createRef<HTMLElement>()
      const childRef = React.createRef<HTMLButtonElement>()

      render(
        <Slot ref={parentRef}>
          <button ref={childRef}>Click</button>
        </Slot>,
      )

      expect(parentRef.current).toBe(childRef.current)
      expect(parentRef.current).toBeInstanceOf(HTMLButtonElement)
    })
  })
})
