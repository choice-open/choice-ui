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
})
