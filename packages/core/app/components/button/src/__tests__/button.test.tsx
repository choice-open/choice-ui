/**
 * Button bug-focused tests
 *
 * BUG 1.1: loading spinner hidden when children is a React element
 *   - User scenario: Developer passes an icon + text as a single React element child, sets loading=true
 *   - Regression it prevents: Loading state shows no visual feedback when children is an element
 *   - Logic change that makes it fail: The `isValidElement(children)` check (line 74) takes
 *     priority over the `loading` branch (line 78). Fix = check loading first.
 *
 * BUG 1.3: readOnly doesn't suppress click in asChild mode for non-button children
 *   - User scenario: Consumer uses asChild with a div, expects readOnly to block interaction
 *   - Regression it prevents: Click handlers on child elements bypass readOnly guard
 *   - Logic change that makes it fail: handleClick is set to undefined (line 98), but
 *     disabled={disabled || loading} doesn't include readOnly (line 106). For non-button
 *     elements, HTML disabled doesn't prevent click events.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "../button"

describe("Button bugs", () => {
  describe("BUG 1.1: loading spinner must show even when children is a React element", () => {
    it("shows spinner when loading=true and children is a wrapper element containing text", async () => {
      render(
        <Button loading>
          <span>Submit</span>
        </Button>,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("aria-busy", "true")

      const hasSpinner = button.querySelector(".animate-spin")
      expect(hasSpinner).not.toBeNull()
    })
  })

  describe("BUG 1.3: readOnly must block interaction in asChild mode with non-button element", () => {
    it("prevents click from firing when readOnly=true with asChild div", async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button
          asChild
          readOnly
          onClick={onClick}
        >
          <div data-testid="child">Click</div>
        </Button>,
      )

      await user.click(screen.getByTestId("child"))
      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
