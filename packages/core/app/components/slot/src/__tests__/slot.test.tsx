/**
 * Slot bug-focused tests
 *
 * BUG 1: mergeProps does not merge unknown prop types, only handles on/style/className
 *   User scenario: Developer passes data-testid on Slot AND on the child.
 *   The Slot's data-testid is silently lost because mergeProps only handles
 *   on* handlers, style, and className.
 *   Regression it prevents: Slot props being silently dropped for non-handler/string props
 *   Logic change: slot.tsx:61-87 mergeProps iterates childProps and only special-cases
 *   handlers, style, and className. For all other props, the child value wins.
 *   Fix = for simple string props, prefer slot prop when child prop does not exist.
 *
 * BUG 2: Slot must handle event handlers when cloning child
 *   User scenario: Slot wraps a button with onClick. Both slot and child onClick should fire.
 *   Regression it prevents: Event handlers not properly merged
 */
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Slot } from "../slot"

describe("Slot bugs", () => {
  describe("BUG 1: mergeProps must not silently drop slot data-testid", () => {
    it("merges data-testid from slot props onto child element", () => {
      render(
        <Slot data-testid="slot-test-id">
          <button data-testid="child-test-id">Click</button>
        </Slot>,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("data-testid", "slot-test-id")
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
})
