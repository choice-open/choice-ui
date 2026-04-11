/**
 * OTP Input bug-focused tests
 *
 * BUG 1: Missing forwardRef — ref is typed as accepted but silently dropped
 *   - User scenario: Developer passes a ref to <OtpInput> to programmatically focus the
 *     underlying input element (e.g., auto-focus on mount, focus on error shake animation).
 *   - Regression it prevents: ref.current stays null, making imperative focus impossible.
 *   - Logic change that makes it fail: OTPInputRoot (otp-input.tsx:33) is a plain function
 *     component not wrapped in forwardRef. Fix = wrap OTPInputRoot in React.forwardRef and
 *     forward the ref into the OTPInput component's ref prop.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import { beforeAll, describe, expect, it } from "vitest"
import { OtpInput } from "../otp-input"

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe("OTP Input bugs", () => {
  describe("BUG 1: ref must be forwarded to the underlying input element", () => {
    it("provides a ref pointing to the HTML input element", () => {
      const ref = createRef<HTMLInputElement>()

      render(
        <OtpInput
          ref={ref}
          maxLength={6}
        >
          <OtpInput.Group>
            <OtpInput.Slot index={0} />
          </OtpInput.Group>
        </OtpInput>,
      )

      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe("INPUT")
    })

    it("allows imperative focus via ref after mount", () => {
      const ref = createRef<HTMLInputElement>()

      render(
        <OtpInput
          ref={ref}
          maxLength={6}
        >
          <OtpInput.Group>
            <OtpInput.Slot index={0} />
          </OtpInput.Group>
        </OtpInput>,
      )

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(typeof ref.current!.focus).toBe("function")
    })
  })
})
