/**
 * Link Button bug-focused tests
 *
 * BUG 1: onClick fires on disabled anchor links
 *   - User scenario: Developer renders <LinkButton href="/page" disabled onClick={fn}>.
 *     The button variant correctly blocks onClick via native `disabled` attr, but the
 *     link variant only blocks onClick for `readOnly`, NOT `disabled`. Clicking a
 *     disabled link still fires the callback.
 *   - Regression it prevents: Disabled links being clickable
 *   - Logic change: link-button.tsx:76-78 — `handleClick` only checks `readOnly`,
 *     not `disabled`. Fix = check both: `readOnly || disabled ? undefined : onClick`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { LinkButton } from "../link-button"

describe("Link Button bugs", () => {
  describe("BUG 1: onClick must NOT fire when disabled link is clicked", () => {
    it("does not call onClick when a disabled link is clicked", async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()

      render(
        <LinkButton
          href="/page"
          disabled
          onClick={onClick}
        >
          Click Me
        </LinkButton>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("aria-disabled", "true")

      await user.click(link)

      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
