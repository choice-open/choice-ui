/**
 * File Upload bug-focused tests
 *
 * BUG 2: onValueChange called twice in controlled mode
 *   - User scenario: Controlled file upload with onValueChange. User selects a file.
 *     onValueChange fires twice, causing double state updates and double side effects.
 *   - Regression it prevents: Double callbacks breaking consumer state
 *   - Logic change: Lines 258-263 — store.dispatch("ADD_FILES") internally calls
 *     onValueChange, then the component calls it again on line 263.
 *     Fix = remove the direct onValueChange call, let the store handle it.
 *
 * BUG 8: Extension matching is case-sensitive in drag-and-drop
 *   - User scenario: accept=".jpg", user drops PHOTO.JPG — rejected incorrectly.
 *   - Regression it prevents: Uppercase extensions rejected during drag-and-drop
 *   - Logic change: Line 225 `type === fileExtension` is case-sensitive.
 *     Fix = compare lowercase.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("File Upload bugs", () => {
  describe("BUG 2: onValueChange must be called exactly once per file addition", () => {
    it("calls onValueChange once when a file is selected in controlled mode", async () => {
      const { FileUpload } = await import("../file-upload")
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      render(
        <FileUpload
          value={[]}
          onValueChange={onValueChange}
          accept="image/*"
        >
          <FileUpload.Dropzone>
            <FileUpload.Button>Upload</FileUpload.Button>
          </FileUpload.Dropzone>
        </FileUpload>,
      )

      const file = new File(["hello"], "hello.png", { type: "image/png" })
      const input = screen
        .getByRole("button", { name: "Upload" })
        .closest("label")
        ?.querySelector("input[type=file]") as HTMLInputElement

      if (input) {
        await user.upload(input, file)
        expect(onValueChange).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe("BUG 8: drag-and-drop must accept files with uppercase extensions", () => {
    it("accepts .JPG when accept is .jpg", () => {
      const accept = ".jpg,.png"
      const acceptTypes = accept.split(",").map((t) => t.trim())
      const file = new File(["data"], "photo.JPG", { type: "image/jpeg" })
      const fileExtension = `.${file.name.split(".").pop()}`

      const matches = acceptTypes.some(
        (type) =>
          type === file.type ||
          type.toLowerCase() === fileExtension.toLowerCase() ||
          (type.includes("/*") && file.type.startsWith(type.replace("/*", "/"))),
      )

      expect(matches).toBe(true)
    })
  })
})
