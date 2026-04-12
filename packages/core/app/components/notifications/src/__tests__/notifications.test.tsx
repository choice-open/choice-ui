/**
 * Notifications bug-focused tests
 *
 * BUG 1: Default position "bottom-right" overridden by spread of undefined
 *   - User scenario: Developer calls notifications({ text: "Hi" }) without position.
 *     sonnerOptions contains position: undefined. The spread { position: "bottom-right",
 *     ...sonnerOptions } results in position: undefined, overriding the default.
 *   - Regression it prevents: Notifications appearing at wrong position
 *   - Logic change: Line 103-104. position is not destructured out of toast before
 *     spreading sonnerOptions. sonnerOptions contains position: undefined when not provided.
 *     Fix = destructure position: `const { position, icon, text, ...sonnerOptions } = toast`.
 *
 * BUG 2: No role or aria-live on the toast root element
 *   - User scenario: Screen reader user receives a notification. Without role="status"
 *     or aria-live, the screen reader never announces the notification.
 *   - Regression it prevents: Notifications invisible to assistive technology
 *   - Logic change that makes it fail: In notifications.tsx:50-51, the root div has
 *     no role or aria-live attribute. Fix = add role="status" and aria-live="polite".
 *
 * BUG 3: Buttons missing type=button, can accidentally submit forms
 *   - User scenario: Developer renders a notification inside a <form>. Clicking
 *     the action button submits the form because <button> defaults to type="submit".
 *   - Regression it prevents: Unintended form submission from notification buttons
 *   - Logic change that makes it fail: In notifications.tsx:62,71, the <button>
 *     elements have no type="button" attribute. Fix = add type="button".
 *
 * BUG 5: Dismiss button does not actually dismiss the toast
 *   - User scenario: User clicks "Dismiss" on a notification. The onClick callback
 *     fires but the toast remains visible because sonnerToast.dismiss(id) is never called.
 *   - Regression it prevents: Toasts that can't be dismissed by clicking dismiss button
 *   - Logic change that makes it fail: In notifications.tsx:46-48, handleDismissClick
 *     only calls actionButtons?.dismiss?.onClick() without calling sonnerToast.dismiss(id).
 *     Fix = add sonnerToast.dismiss(id) after calling the user callback.
 *
 * BUG 6: Empty notification rendered when both text and html are missing
 *   - User scenario: Developer calls notifications({}) with no text or html.
 *     An empty visible toast shell renders instead of being caught as an error.
 *   - Regression it prevents: Empty toasts visible to users
 *   - Logic change that makes it fail: In notifications.tsx:38-40, the guard only
 *     logs a console.warn but still renders the empty component. Fix = return null.
 */
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { describe, expect, it, vi } from "vitest"

describe("Notifications bugs", () => {
  describe("BUG 1: default position must not be overridden by undefined spread", () => {
    it("passes 'bottom-right' position to sonner when position is not provided", async () => {
      const { notifications } = await import("../notifications")
      const sonnerModule = await import("sonner")

      const customSpy = vi.spyOn(sonnerModule.toast, "custom")

      notifications({ text: "Hello" })

      expect(customSpy).toHaveBeenCalled()
      const options = customSpy.mock.calls[0][1] as Record<string, unknown>
      expect(options?.position).toBe("bottom-right")
    })

    it("passes custom position to sonner when explicitly provided", async () => {
      const { notifications } = await import("../notifications")
      const sonnerModule = await import("sonner")

      const customSpy = vi.spyOn(sonnerModule.toast, "custom")

      notifications({ text: "Hello", position: "top-center" })

      expect(customSpy).toHaveBeenCalled()
      const options = customSpy.mock.calls[0][1] as Record<string, unknown>
      expect(options?.position).toBe("top-center")
    })
  })

  describe("BUG 2: Notification root must have role=status for screen readers", () => {
    it("renders the notification with role=status attribute", async () => {
      const mod = await import("../notifications")
      const Toast = (mod as any).default || mod.notifications

      const ToastComp = typeof Toast === "function" ? Toast : null
      expect(ToastComp).toBeTruthy()

      render(
        <ToastComp!
          id="test-1"
          text="Test notification"
        />,
      )

      const notification = screen.getByText("Test notification")
      expect(notification).toBeTruthy()
      const rootDiv = notification.closest("[class]")
      expect(rootDiv).toBeTruthy()
      const role = rootDiv?.getAttribute("role")
      expect(role).toBe("status")
    })
  })

  describe("BUG 3: Notification buttons must have type=button", () => {
    it("renders action button with type=button, not type=submit", async () => {
      const { default: ToastBase } = await import("../notifications")

      const Toast = (ToastBase as any).type || ToastBase

      render(
        <Toast
          id="test-2"
          text="Test"
          actions={() => ({
            action: { content: "Confirm", onClick: vi.fn() },
          })}
        />,
      )

      const actionButton = screen.getByText("Confirm")
      expect(actionButton.getAttribute("type")).toBe("button")
    })
  })

  describe("BUG 5: dismiss button must call sonnerToast.dismiss", () => {
    it("calls sonnerToast.dismiss when dismiss button is clicked", async () => {
      const { default: ToastBase } = await import("../notifications")
      const sonnerModule = await import("sonner")

      const Toast = (ToastBase as any).type || ToastBase
      const dismissOnClick = vi.fn()
      const dismissSpy = vi.spyOn(sonnerModule.toast, "dismiss")

      render(
        <Toast
          id="dismiss-test"
          text="Dismissable"
          actions={() => ({
            dismiss: { content: "Dismiss", onClick: dismissOnClick },
          })}
        />,
      )

      const dismissButton = screen.getByText("Dismiss")
      fireEvent.click(dismissButton)

      expect(dismissOnClick).toHaveBeenCalled()
      expect(dismissSpy).toHaveBeenCalledWith("dismiss-test")
    })
  })

  describe("BUG 6: notification must not render empty shell when text and html are missing", () => {
    it("renders nothing when both text and html are undefined", async () => {
      const { default: ToastBase } = await import("../notifications")

      const Toast = (ToastBase as any).type || ToastBase

      const { container } = render(<Toast id="empty-test" />)

      expect(container.innerHTML).toBe("")
    })
  })
})
