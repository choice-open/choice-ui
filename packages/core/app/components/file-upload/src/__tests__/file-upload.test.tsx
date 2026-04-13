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
import { beforeAll, describe, expect, it, vi } from "vitest"

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

function createFileList(files: File[]): FileList {
  const fileList = Object.create(FileList.prototype) as FileList
  for (let i = 0; i < files.length; i++) {
    Object.defineProperty(fileList, i, { value: files[i], enumerable: true, configurable: true })
  }
  Object.defineProperty(fileList, "length", {
    value: files.length,
    enumerable: true,
    configurable: true,
  })
  Object.defineProperty(fileList, Symbol.iterator, {
    value: function* () {
      for (let i = 0; i < files.length; i++) yield files[i]
    },
    configurable: true,
  })
  return fileList
}

beforeAll(() => {
  if (typeof DataTransfer === "undefined") {
    ;(globalThis as any).DataTransfer = class MockDataTransfer {
      private _files: File[] = []

      get files(): FileList {
        return createFileList(this._files)
      }

      get items() {
        const self = this
        return {
          add(data: File | string, _type?: string) {
            if (data instanceof File) {
              self._files.push(data)
            }
          },
          get length() {
            return self._files.length
          },
        }
      }

      get types() {
        return this._files.length > 0 ? ["Files"] : []
      }
    }
  }
})

describe("File Upload bugs", () => {
  describe("BUG 2: onValueChange must be called exactly once per file addition", () => {
    it("calls onValueChange once when a file is selected in controlled mode", async () => {
      const { FileUpload } = await import("../file-upload")
      const onValueChange = vi.fn()
      const user = userEvent.setup()

      const { container } = render(
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
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

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

      await waitFor(() => {
        expect(onFileAccept).toHaveBeenCalledWith(file)
      })
      expect(onFileReject).not.toHaveBeenCalledWith(expect.anything(), "File type not accepted")
    })
  })
})
