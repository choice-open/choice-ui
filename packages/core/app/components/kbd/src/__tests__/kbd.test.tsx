/**
 * Kbd bug-focused tests
 *
 * BUG 1: <abbr> elements inside <kbd> have no accessible label
 *   - User scenario: Screen reader encounters <kbd>⌘</kbd><span>C</span>.
 *     The <abbr title="Command">⌘</abbr> provides a title for sighted users'
 *     tooltip, but screen readers may not announce the title on an abbr inside kbd.
 *     The accessible name of the <kbd> should convey "Command+C" not just "⌘C".
 *   - Regression it prevents: Keyboard shortcuts unreadable by screen readers
 *   - Logic change that makes it fail: kbd.tsx:20-27 — <abbr> uses title attribute
 *     but no aria-label. The kbd element has no aria-label either. Fix = add
 *     aria-label to the <kbd> with the full readable key combination, or use
 *     <span aria-label={label}> instead of <abbr title={label}>.
 *
 * BUG 2: children is wrapped in an extra <span> that breaks screen reader output
 *   - User scenario: Developer renders <Kbd keys={["command"]}>C</Kbd>.
 *     The DOM renders: <kbd><abbr>⌘</abbr><span>C</span></kbd>.
 *     Some screen readers announce this as "⌘ C" (with pause) instead of "⌘C",
 *     because the <span> creates a separate text node boundary.
 *   - Regression it prevents: Fragmented screen reader output for keyboard shortcuts
 *   - Logic change: kbd.tsx:36 — `{children && <span>{children}</span>}` wraps
 *     children in an unnecessary <span>. Fix = render children directly without wrapper.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Kbd } from "../kbd"

describe("Kbd bugs", () => {
  describe("BUG 1: kbd must have an accessible name for keyboard shortcuts", () => {
    it("has an aria-label with the full readable key name when keys prop is provided", () => {
      render(<Kbd keys={["command", "shift"]}>P</Kbd>)

      const kbd = screen.getByRole("text") as HTMLElement
      const kbdElement = document.querySelector("kbd")
      expect(kbdElement).toBeTruthy()

      const ariaLabel = kbdElement?.getAttribute("aria-label")
      expect(ariaLabel).toBeTruthy()
    })

    it("abbr elements have title attributes for key labels", () => {
      render(<Kbd keys={["command"]} />)

      const abbr = document.querySelector("kbd abbr")
      expect(abbr).toBeTruthy()
      expect(abbr).toHaveAttribute("title", "Command")
    })
  })

  describe("BUG 2: children must render as direct text, not wrapped in extra span", () => {
    it("does not wrap children in an unnecessary span element", () => {
      render(<Kbd keys={["command"]}>C</Kbd>)

      const kbd = document.querySelector("kbd")
      expect(kbd).toBeTruthy()

      const childSpans = kbd!.querySelectorAll("span")
      expect(childSpans.length).toBe(0)
    })
  })
})
