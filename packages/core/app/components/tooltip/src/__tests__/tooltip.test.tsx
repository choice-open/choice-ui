/**
 * Tooltip bug-focused tests
 *
 * BUG 10: Falsy content values (0, "") silently skip rendering
 *   - User scenario: <Tooltip content={notificationCount}>...</Tooltip> where count is 0.
 *     The tooltip should show "0" but nothing appears because `if (content)` is false.
 *   - Regression it prevents: Valid renderable values (0) being silently dropped
 *   - Logic change: Line 34 `if (content)` uses truthiness check. 0 is falsy.
 *     Fix = `if (content !== undefined && content !== null)`.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Tooltip } from "../tooltip"

describe("Tooltip bugs", () => {
  describe("BUG 10: content={0} must render the tooltip", () => {
    it("renders tooltip content when content is the number 0", async () => {
      render(
        <Tooltip
          content={0}
          open
        >
          <button>Notifications</button>
        </Tooltip>,
      )

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument()
      })
      expect(screen.getByRole("tooltip")).toHaveTextContent("0")
    })
  })
})
