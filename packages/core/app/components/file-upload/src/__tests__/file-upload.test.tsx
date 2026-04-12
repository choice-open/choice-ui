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
 *   - Logic change: file-upload.tsx:225-227 — `type === fileExtension` is
 *     case-sensitive. Fix = compare lowercase.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

      expect(input).toBeTruthy()
      await user.upload(input, file)
      expect(onValueChange).toHaveBeenCalledTimes(1)
    })
  })

  describe("BUG 8: drag-and-drop must accept files with uppercase extensions", () => {
    it("does not reject a dropped .JPG file when accept is '.jpg'", async () => {
      const { FileUpload } = await import("../file-upload")
      const onFileAccept = vi.fn()
      const onFileReject = vi.fn()

      render(
        <FileUpload
          accept=".jpg"
          onFileAccept={onFileAccept}
          onFileReject={onFileReject}
        >
          <FileUpload.Dropzone data-testid="dropzone">
            <FileUpload.Button>Upload</FileUpload.Button>
          </FileUpload.Dropzone>
        </FileUpload>,
      )

      const dropzone = screen.getByTestId("dropzone")
      const file = new File(["data"], "PHOTO.JPG", { type: "image/jpeg" })

      // Build a DataTransfer-shaped mock that the dropzone's onDrop handler
      // can read via `event.dataTransfer.files`. The dropzone then forwards
      // the files through the hidden input's change event, which is where the
      // extension-matching logic actually runs inside FileUpload.
      const dataTransfer = {
        files: [file],
        items: [
          {
            kind: "file",
            type: file.type,
            getAsFile: () => file,
          },
        ],
        types: ["Files"],
      }

      fireEvent.drop(dropzone, { dataTransfer })

      // With the bug, ".jpg" is compared against ".JPG" with strict equality
      // and the file is rejected as "File type not accepted". A correct fix
      // (lowercase compare) accepts it — so onFileAccept fires and
      // onFileReject is never called with the type-rejection message.
      await waitFor(() => {
        expect(onFileAccept).toHaveBeenCalledWith(file)
      })
      expect(onFileReject).not.toHaveBeenCalledWith(expect.anything(), "File type not accepted")
    })
  })
})
