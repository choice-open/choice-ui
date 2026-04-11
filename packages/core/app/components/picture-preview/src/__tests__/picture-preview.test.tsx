/**
 * Picture Preview bug-focused tests
 *
 * BUG 1 (High): Zoom and pan position not reset when src changes
 *   - User scenario: User zooms into an image, then the component switches to a
 *     different image via src prop change. The new image should appear at default
 *     zoom level and centered position.
 *   - Regression it prevents: New images appearing magnified or off-center after
 *     viewing a zoomed/panned previous image.
 *   - Logic change that makes it fail: In picture-preview.tsx:274-303, the useEffect
 *     that runs on src change resets isLoading, isError, and naturalSize but does
 *     NOT reset zoom or position. Fix = add setZoom(INITIAL_ZOOM) and
 *     updatePosition({x:0, y:0}) to the src-change effect.
 *
 * BUG 2 (Medium): onClose prop is silently ignored
 *   - User scenario: Consumer provides onClose callback expecting it to be invoked
 *     when the user presses Escape to dismiss the preview.
 *   - Regression it prevents: Escape key has no effect when onClose is provided,
 *     leaving users unable to close the preview via keyboard.
 *   - Logic change that makes it fail: In picture-preview.tsx:43, onClose is
 *     destructured from props but never referenced again. No Escape hotkey is
 *     registered in the useHotkeys call (lines 175-192). Fix = register an Escape
 *     hotkey that calls onClose, or add keydown listener for Escape.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PicturePreview } from "../picture-preview"

const imageInstances: Array<{
  onload: (() => void) | null
  onerror: (() => void) | null
  src: string
  naturalWidth: number
  naturalHeight: number
}> = []

const OriginalImage = globalThis.Image

beforeEach(() => {
  imageInstances.length = 0

  globalThis.Image = class MockImage {
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    src = ""
    naturalWidth = 800
    naturalHeight = 600
    constructor() {
      imageInstances.push(this as any)
    }
  } as any

  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {})

  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
})

afterEach(() => {
  globalThis.Image = OriginalImage
  vi.restoreAllMocks()
})

function triggerImageLoad(index?: number) {
  const img =
    index !== undefined ? imageInstances[index] : imageInstances[imageInstances.length - 1]
  if (img?.onload) {
    img.onload()
  }
}

function getCanvas(): HTMLElement {
  const img = screen.getByRole("img")
  return img.parentElement!
}

describe("PicturePreview bugs", () => {
  describe("BUG 1 (High): Zoom and pan position not reset when src changes", () => {
    it("resets zoom to 1 and position to origin when src changes", async () => {
      const { rerender } = render(<PicturePreview src="a.jpg" />)

      triggerImageLoad()

      const canvas = await waitFor(() => {
        const c = getCanvas()
        expect(c.style.transform).toContain("scale(1)")
        return c
      })

      const allButtons = screen.getAllByRole("button")
      const zoomInButton = allButtons[allButtons.length - 1]
      fireEvent.click(zoomInButton)

      await waitFor(() => {
        expect(getCanvas().style.transform).toContain("scale(1.1)")
      })

      rerender(<PicturePreview src="b.jpg" />)
      triggerImageLoad()

      await waitFor(() => {
        expect(getCanvas().style.transform).toContain("scale(1)")
      })
    })
  })

  describe("BUG 2 (Medium): onClose prop is silently ignored", () => {
    it("calls onClose when Escape key is pressed", async () => {
      const onClose = vi.fn()

      render(
        <PicturePreview
          src="a.jpg"
          onClose={onClose}
        />,
      )

      triggerImageLoad()

      await waitFor(() => {
        expect(screen.getByRole("img")).toBeInTheDocument()
      })

      fireEvent.keyDown(screen.getByRole("img").closest("div")!, {
        key: "Escape",
      })

      expect(onClose).toHaveBeenCalled()
    })
  })
})
