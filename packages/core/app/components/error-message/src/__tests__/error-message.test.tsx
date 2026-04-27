/**
 * Error Message bug-focused tests
 *
 * BUG 1: TypeScript says HTMLParagraphElement but renders <em>
 *   - User scenario: Developer uses <ErrorMessage> expecting it to render a <p>
 *     element (as the TypeScript type says). Instead it renders <em> (emphasis).
 *     Screen readers interpret content as "emphasized" rather than an error alert.
 *     Also, paragraph-specific attributes passed by the consumer will be invalid on <em>.
 *   - Regression it prevents: Wrong semantic element + type mismatch
 *   - Logic change: error-message.tsx:4,13 - `ErrorMessageProps extends
 *     React.HTMLAttributes<HTMLParagraphElement>` but renders `<em>`.
 *     Fix = either render `<p>` or change the type to `HTMLElement`.
 *
 * BUG 9: role="alert" can be overridden by {...rest} spread
 *   - User scenario: Consumer passes a custom role via props, e.g.
 *     <ErrorMessage role="status">. The {...rest} spread on line 17 comes AFTER
 *     the explicit role="alert" on line 16, so rest.role overwrites it. Error messages
 *     no longer announce as live alerts to screen reader users.
 *   - Regression it prevents: Accidental loss of alert role breaking screen reader announcements
 *   - Logic change: error-message.tsx:16-17 - `role="alert"` then `{...rest}`.
 *     Fix = move {...rest} before role="alert", or filter role from rest.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ErrorMessage } from "../error-message"

describe("Error Message bugs", () => {
  describe("BUG 1: must render as a <p> element matching its TypeScript type", () => {
    it("renders an error message inside a <p> element, not <em>", () => {
      render(<ErrorMessage>Something went wrong</ErrorMessage>)

      const element = screen.getByText("Something went wrong")
      expect(element.tagName.toLowerCase()).toBe("p")
    })
  })

  describe("BUG 9: role=alert must not be overridable by rest props", () => {
    it("keeps role=alert even when a conflicting role is passed via props", () => {
      render(<ErrorMessage role="status">Something went wrong</ErrorMessage>)

      const element = screen.getByText("Something went wrong")
      expect(element).toHaveAttribute("role", "alert")
    })
  })
})
