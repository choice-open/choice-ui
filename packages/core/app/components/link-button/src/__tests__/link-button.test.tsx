/**
 * Link Button bug-focused tests
 *
 * BUG 1: onClick fires on disabled anchor links
 *   - User scenario: Developer renders <LinkButton href="/page" disabled onClick={fn}>.
 *     The button variant correctly blocks onClick via native `disabled` attr, but the
 *     link variant only blocks onClick for `readOnly`, NOT `disabled`. Clicking a
 *     disabled link still fires the callback.
 *   - Regression it prevents: Disabled links being clickable
 *   - Logic change: link-button.tsx:76-78 - `handleClick` only checks `readOnly`,
 *     not `disabled`. Fix = check both: `readOnly || disabled ? undefined : onClick`.
 *
 * BUG 9: Case-sensitive external link detection misses uppercase protocols
 *   - User scenario: Developer passes href="HTTP://example.com". The check at line 67
 *     `href.startsWith("http")` is case-sensitive, so uppercase protocols are not
 *     detected as external. The link misses rel="noopener noreferrer" and target="_blank".
 *   - Regression it prevents: Security attributes missing on uppercase external URLs
 *   - Logic change: link-button.tsx:67 - `href.startsWith("http")` is case-sensitive.
 *     Fix = use `href.toLowerCase().startsWith("http")` or a regex.
 *
 * BUG 10: href="" treated as button instead of anchor
 *   - User scenario: Developer passes href="" expecting a self-referencing link. The
 *     truthy check at line 62 `props.href` fails for empty string, so it renders as
 *     <button> instead of <a>. The TypeScript type allows href: string which includes "".
 *   - Regression it prevents: Unexpected element type for empty href
 *   - Logic change: link-button.tsx:62 - `"href" in props && props.href` uses truthy
 *     check. Empty string is falsy. Fix = check `"href" in props` alone.
 *
 * BUG 4: readOnly link must not fire onClick
 *   - User scenario: Developer renders a readOnly link. Clicking it should not fire
 *     the onClick handler, similar to disabled.
 *   - Regression it prevents: ReadOnly links being clickable
 *   - Logic change: link-button.tsx:76-78 - handleClick guards with readOnly || disabled.
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

  describe("BUG 9: uppercase protocol URLs must be detected as external", () => {
    it("adds rel=noopener noreferrer for HTTP:// protocol (uppercase)", () => {
      render(<LinkButton href="HTTP://example.com">External Link</LinkButton>)

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel")
      const rel = link.getAttribute("rel") || ""
      expect(rel).toContain("noopener")
      expect(rel).toContain("noreferrer")
    })
  })

  describe("BUG 10: href='' must render as anchor, not button", () => {
    it("renders an anchor element when href is empty string", () => {
      render(<LinkButton href="">Self Link</LinkButton>)

      const anchor = screen.queryByRole("link")
      expect(anchor).toBeTruthy()
    })
  })

  describe("BUG 4: readOnly link must suppress onClick and remove href", () => {
    it("does not call onClick, removes href, sets aria-disabled and tabIndex=-1", async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()

      render(
        <LinkButton
          href="/page"
          readOnly
          onClick={onClick}
        >
          ReadOnly Link
        </LinkButton>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("aria-disabled", "true")
      expect(link).toHaveAttribute("tabindex", "-1")
      expect(link).not.toHaveAttribute("href")

      await user.click(link)

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe("BUG 5: external link rel must merge with user-provided rel", () => {
    it("preserves user rel and appends noopener noreferrer", () => {
      render(
        <LinkButton
          href="https://example.com"
          rel="nofollow"
        >
          External
        </LinkButton>,
      )

      const link = screen.getByRole("link")
      const rel = link.getAttribute("rel") || ""
      expect(rel).toContain("nofollow")
      expect(rel).toContain("noopener")
      expect(rel).toContain("noreferrer")
    })
  })

  describe("BUG 6: user-provided target must not be overridden for external links", () => {
    it("keeps target=_self when explicitly provided for external URL", () => {
      render(
        <LinkButton
          href="https://example.com"
          target="_self"
        >
          Same Window
        </LinkButton>,
      )

      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("target", "_self")
    })
  })

  describe("BUG 7: internal href must NOT receive external safety attributes", () => {
    it("does not add target=_blank or rel=noopener for relative URLs", () => {
      render(<LinkButton href="/local-page">Internal</LinkButton>)

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("target", "_blank")
      expect(link).not.toHaveAttribute("rel")
    })
  })

  describe("BUG 8: readOnly button must suppress onClick and set disabled", () => {
    it("does not call onClick and renders a disabled button element", async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()

      render(
        <LinkButton
          readOnly
          onClick={onClick}
        >
          ReadOnly Btn
        </LinkButton>,
      )

      const button = screen.getByRole("button")
      expect(button).toBeDisabled()

      await user.click(button)

      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
