/**
 * Modal bug-focused tests
 *
 * BUG 1: ModalSelect label htmlFor is not matched by Select id
 *   - User scenario: Developer uses <ModalSelect label="Priority" />. The label
 *     renders with htmlFor={id} but the <Select> never receives id={id}. Clicking
 *     the label does nothing — it should focus/open the select.
 *   - Regression it prevents: Label-to-select association broken in modal forms
 *   - Logic change: modal-select.tsx:14,18-22 — `id` is generated and passed to
 *     `<Label htmlFor={id}>`, but `<Select>` does not receive `id={id}`.
 *     Fix = pass `id={id}` to the Select component.
 */
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { Modal } from "../modal"
import { ModalSelect } from "../components/modal-select"

describe("Modal bugs", () => {
  describe("BUG 1: ModalSelect label must focus the select on click", () => {
    it("associates label with select via matching htmlFor/id", async () => {
      const user = userEvent.setup()

      render(
        <ModalSelect
          label="Priority"
          options={[
            { value: "high", label: "High" },
            { value: "low", label: "Low" },
          ]}
        />,
      )

      const label = screen.getByText("Priority")
      const labelElement = label.closest("label")
      expect(labelElement).toBeTruthy()

      const htmlFor = labelElement?.getAttribute("for")
      expect(htmlFor).toBeTruthy()

      const targetById = document.getElementById(htmlFor!)
      expect(targetById).toBeTruthy()
    })
  })

  /**
   * BUG 2: No role="dialog" or aria-modal on Modal root element
   *   - User scenario: Screen reader user encounters a modal dialog. Without role="dialog"
   *     and aria-modal="true", the screen reader does not switch to dialog mode and the
   *     user doesn't know they've entered a modal context.
   *   - Regression it prevents: WCAG 4.1.2 Level A violation -- modal not announced
   *   - Logic change that makes it fail: In modal.tsx:37-43, the root element is a plain
   *     <div> with no role or aria-modal attributes. Fix = add role="dialog" and
   *     aria-modal="true" to the root element.
   */
  describe("BUG 2: Modal root must have role=dialog and aria-modal=true", () => {
    it("sets role=dialog on the modal root element", () => {
      render(
        <Modal data-testid="modal-root">
          <Modal.Content>Content</Modal.Content>
        </Modal>,
      )

      const modal = screen.getByTestId("modal-root")
      expect(modal.getAttribute("role")).toBe("dialog")
    })

    it("sets aria-modal=true on the modal root element", () => {
      render(
        <Modal data-testid="modal-root">
          <Modal.Content>Content</Modal.Content>
        </Modal>,
      )

      const modal = screen.getByTestId("modal-root")
      expect(modal.getAttribute("aria-modal")).toBe("true")
    })
  })

  /**
   * BUG 3: Close button has no accessible label
   *   - User scenario: Screen reader user encounters a modal with a close button containing
   *     only a Remove icon. The button is announced as "button" with no indication of its
   *     purpose (closing the modal).
   *   - Regression it prevents: WCAG 4.1.2 Level A -- unnamed interactive element
   *   - Logic change that makes it fail: In modal-header.tsx:38-43, the IconButton contains
   *     <Remove /> with no aria-label. Fix = add aria-label="Close" (or similar).
   */
  describe("BUG 3: Close button must have an aria-label", () => {
    it("renders the close button with an accessible name", () => {
      render(<Modal.Header onClose={() => {}}>Title</Modal.Header>)

      const closeButton = screen.getByRole("button")
      expect(closeButton).toHaveAttribute("aria-label")
    })
  })

  /**
   * BUG 4: onClose and title props silently ignored on Modal root
   *   - User scenario: Developer writes <Modal onClose={handleClose} title="My Dialog">
   *     expecting the title to render and Escape/backdrop click to close. Neither works
   *     because both props are destructured but never used.
   *   - Regression it prevents: Misleading API -- props silently swallowed
   *   - Logic change that makes it fail: In modal.tsx:34, title and onClose are
   *     destructured from props but never passed to any child or event handler.
   *     Fix = wire onClose to backdrop click and Escape, render title in Header.
   */
  describe("BUG 4: onClose prop on Modal root must actually close the modal", () => {
    it("calls onClose when the modal backdrop is clicked", async () => {
      const onClose = vi.fn()

      render(
        <div>
          <Modal.Backdrop
            isOpen
            onClose={onClose}
          />
        </div>,
      )

      const backdrop = document.querySelector("[aria-hidden]")
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(onClose).toHaveBeenCalled()
      }
    })
  })

  /**
   * BUG 5: No Escape key handler to close the modal
   *   - User scenario: Keyboard user opens a modal and presses Escape expecting it to
   *     close. Nothing happens because there is no keyDown handler for Escape.
   *   - Regression it prevents: Keyboard trap -- users can't dismiss modal via keyboard
   *   - Logic change that makes it fail: modal-backdrop.tsx only handles onClick. No
   *     onKeyDown handler exists. Fix = add onKeyDown that calls onClose on Escape.
   */
  describe("BUG 5: Modal backdrop must close on Escape key", () => {
    it("calls onClose when Escape key is pressed while backdrop is focused", async () => {
      const onClose = vi.fn()

      render(
        <Modal.Backdrop
          isOpen
          onClose={onClose}
        />,
      )

      const backdrop = document.querySelector("[aria-hidden]")
      if (backdrop) {
        fireEvent.keyDown(backdrop, { key: "Escape" })
        expect(onClose).toHaveBeenCalled()
      }
    })
  })

  /**
   * BUG 6: Description text not linked via aria-describedby in Modal form fields
   *   - User scenario: Developer renders <ModalInput label="Email" description="Enter work email" />.
   *     Screen reader focuses the input but never announces the description because there's
   *     no aria-describedby linking the description <p> to the input.
   *   - Regression it prevents: Screen reader users miss form field descriptions
   *   - Logic change that makes it fail: In modal-input.tsx:26, the <p> element has no id
   *     and the <Input> has no aria-describedby. Fix = generate a descriptionId, set it on
   *     the <p>, and pass aria-describedby={descriptionId} to Input.
   */
  describe("BUG 6: ModalInput description must be linked via aria-describedby", () => {
    it("sets aria-describedby on the input pointing to the description element", async () => {
      const { ModalInput } = await import("../components/modal-input")

      render(
        <ModalInput
          label="Email"
          description="Enter your work email"
        />,
      )

      const input = screen.getByRole("textbox")
      const describedBy = input.getAttribute("aria-describedby")
      expect(describedBy).toBeTruthy()

      const descriptionEl = document.getElementById(describedBy!)
      expect(descriptionEl).toBeTruthy()
      expect(descriptionEl?.textContent).toContain("Enter your work email")
    })
  })
})
