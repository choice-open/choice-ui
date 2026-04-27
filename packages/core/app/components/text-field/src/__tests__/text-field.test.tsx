/**
 * Text Field bug-focused tests
 *
 * BUG 1: className double-applied when label or description is present
 *   - User scenario: Developer renders <TextField className="my-class"> with a Label
 *     child. The className "my-class" is applied to BOTH the outer wrapper <div> AND
 *     the inner TextFieldContent div. This causes doubled padding, margin, borders, etc.
 *   - Regression it prevents: className being applied twice in the DOM
 *   - Logic change: text-field.tsx:104,112 — outer `<div className={tcx(tv.container(), className)}>`
 *     and inner `<TextFieldContent className={className}>`. When label/description is present,
 *     both get the same className. Fix = only apply className to the outer wrapper.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { TextField } from "../text-field"

describe("Text Field bugs", () => {
  describe("BUG 1: className must be applied only once when a Label is present", () => {
    it("does not duplicate className on both wrapper and content div", () => {
      render(
        <TextField
          className="unique-test-class"
          placeholder="Enter text"
        >
          <TextField.Label>Name</TextField.Label>
        </TextField>,
      )

      const elementsWithClass = document.querySelectorAll(".unique-test-class")
      expect(elementsWithClass.length).toBe(1)
    })
  })

  /**
   * DISABLED STATE
   *   User scenario: Developer renders <TextField disabled> with a Label.
   *     The underlying input must be disabled so the user cannot type.
   *   Regression it prevents: Disabled prop not being forwarded to the <input> element
   *   Logic change: inputProps spreads disabled into <Input>. If the spread breaks,
   *     the input remains interactive despite disabled=true.
   */
  describe("disabled state", () => {
    it("renders a disabled input when disabled prop is true", () => {
      render(
        <TextField
          disabled
          placeholder="Can't type"
        >
          <TextField.Label>Field</TextField.Label>
        </TextField>,
      )

      const input = screen.getByPlaceholderText("Can't type")
      expect(input).toBeDisabled()
    })
  })

  /**
   * LABEL htmlFor ASSOCIATION
   *   User scenario: Screen reader user focuses the label and expects it to
   *     activate the associated input field.
   *   Regression it prevents: Label not linked to input via htmlFor
   *   Logic change: TextField clones the label with htmlFor=uuid. If the cloneElement
   *     logic breaks, clicking the label won't focus the input.
   */
  describe("label htmlFor association", () => {
    it("associates the label with the input via htmlFor/id", async () => {
      const user = userEvent.setup()

      render(
        <TextField placeholder="Type here">
          <TextField.Label>Username</TextField.Label>
        </TextField>,
      )

      const input = screen.getByPlaceholderText("Type here")
      const label = input.closest("div")?.parentElement?.querySelector("label")
      expect(label).toBeTruthy()
      expect(label).toHaveAttribute("for", input.id)

      await user.click(label!)
      expect(input).toHaveFocus()
    })
  })

  /**
   * INPUT VALUE CHANGE
   *   User scenario: User types into the text field and expects the input's value
   *     to reflect what they typed.
   *   Regression it prevents: Input not receiving onChange events or value not updating
   *   Logic change: Input receives {...rest} spread which includes onChange. If the
   *     forwarding breaks, typed characters don't appear.
   */
  describe("input value change", () => {
    it("updates the displayed value when the user types", async () => {
      const user = userEvent.setup()

      render(<TextField placeholder="Type here" />)

      const input = screen.getByPlaceholderText("Type here")
      await user.type(input, "hello")

      expect(input).toHaveValue("hello")
    })
  })
})
