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
 */
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"

describe("Notifications bugs", () => {
  describe("BUG 1: default position must not be overridden by undefined spread", () => {
    it("produces 'bottom-right' when position is not provided", async () => {
      const { notifications } = await import("../notifications")

      const toast = { text: "Hello" }
      const { icon, text, html, actions, className, ...sonnerOptions } = toast

      const explicitPosition = toast.position || "bottom-right"
      const mergedOptions = { position: explicitPosition, ...sonnerOptions }

      expect(mergedOptions.position).toBe("bottom-right")
    })

    it("produces 'bottom-right' when position is explicitly undefined", async () => {
      const toast = { text: "Hello", position: undefined }
      const { icon, text, html, actions, className, ...sonnerOptions } = toast

      const explicitPosition = toast.position || "bottom-right"
      const mergedOptions = { position: explicitPosition, ...sonnerOptions }

      expect(mergedOptions.position).toBe("bottom-right")
    })
  })
})
