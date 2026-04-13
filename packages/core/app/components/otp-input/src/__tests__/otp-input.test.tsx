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

  /**
   * BUG 2: Missing aria-hidden on visual slot divs causes screen reader double-reading
   *   - User scenario: Screen reader user fills in an OTP code. Each digit is announced
   *     twice because the hidden input AND the visible slot div both expose text content.
   *   - Regression it prevents: Screen reader double-announcement of OTP digits
   *   - Logic change that makes it fail: In otp-input.tsx:95-106, OTPInputSlot renders
   *     a visual <div> showing the character but without aria-hidden="true". The hidden
   *     <input> already exposes the value to screen readers. Fix = add aria-hidden="true"
   *     to the slot div in OTPInputSlot.
   */
  describe("BUG 2: OTP slot divs must have aria-hidden to prevent double-reading", () => {
    it("renders slot div with aria-hidden=true so screen readers only read the input", () => {
      render(
        <OtpInput
          maxLength={6}
          defaultValue="123456"
        >
          <OtpInput.Group>
            <OtpInput.Slot index={0} />
            <OtpInput.Slot index={1} />
          </OtpInput.Group>
        </OtpInput>,
      )

      const filledSlots = document.querySelectorAll("[data-filled]")
      filledSlots.forEach((slot) => {
        expect(slot.getAttribute("aria-hidden")).toBe("true")
      })
    })
  })

  /**
   * BUG 3: Missing aria-invalid when isInvalid is true
   *   - User scenario: Screen reader user submits an invalid OTP. The input turns red
   *     visually but the screen reader doesn't announce the error state because
   *     aria-invalid is never set on the underlying input element.
   *   - Regression it prevents: Screen reader users unaware of validation errors
   *   - Logic change that makes it fail: In otp-input.tsx:48-63, when isInvalid={true},
   *     data-invalid is set (CSS hook) but aria-invalid is never passed to the OTPInput.
   *     Fix = add aria-invalid={isInvalid || undefined} to the OTPInput props.
   */
  describe("BUG 3: aria-invalid must be set when isInvalid is true", () => {
    it("sets aria-invalid=true on the input when isInvalid={true}", () => {
      render(
        <OtpInput
          maxLength={6}
          isInvalid
        >
          <OtpInput.Group>
            <OtpInput.Slot index={0} />
          </OtpInput.Group>
        </OtpInput>,
      )

      const input = document.querySelector("input")
      expect(input).toBeTruthy()
      expect(input?.getAttribute("aria-invalid")).toBe("true")
    })
  })

  /**
   * BUG 4: placeholderChar from input-otp is silently ignored
   *   - User scenario: Developer passes placeholder="0" to OtpInput expecting empty
   *     slots to show "0" as a visual hint. The prop is silently ignored because
   *     OTPInputSlot never reads placeholderChar from the slot props.
   *   - Regression it prevents: placeholder prop doing nothing
   *   - Logic change that makes it fail: In otp-input.tsx:85, OTPInputSlot destructures
   *     only { char, hasFakeCaret, isActive } from slotProps, ignoring placeholderChar.
   *     Fix = destructure placeholderChar and render it when char is falsy.
   */
  describe("BUG 4: placeholder must render in empty slots when provided", () => {
    it("renders placeholder character in empty slots", () => {
      render(
        <OtpInput
          maxLength={4}
          placeholder="00"
        >
          <OtpInput.Group>
            <OtpInput.Slot index={0} />
            <OtpInput.Slot index={1} />
          </OtpInput.Group>
        </OtpInput>,
      )

      const slotDivs = document.querySelectorAll("[aria-hidden]")
      const emptySlots = Array.from(slotDivs).filter((slot) => !slot.hasAttribute("data-filled"))
      expect(emptySlots.length).toBeGreaterThan(0)
      emptySlots.forEach((slot) => {
        expect(slot.textContent).toContain("0")
      })
    })
  })
})
