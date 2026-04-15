/**
 * BUG 1 (High): Preview animation uses invalid 8-value cubic-bezier() CSS
 *
 *   User scenario:
 *     A designer enables the preview to visualize the easing curve. They set a
 *     custom bezier value (e.g. ease: [0.42, 0, 0.58, 1]) and expect the preview
 *     circle to animate along the SVG path using that exact timing function —
 *     not the browser's default "ease" fallback.
 *
 *   Regression it prevents:
 *     The browser silently ignores invalid cubic-bezier() CSS (which requires
 *     exactly 4 arguments) and falls back to "ease". The preview circle still
 *     animates but does NOT reflect the configured curve — users see a
 *     misleading preview that doesn't match their settings.
 *
 *   Logic change that makes this test fail:
 *     In bezier-curve-editor-curve.tsx line 104, `animationTimingFunction` is set
 *     to `cubic-bezier(${value})` where `value` is the 8-element expanded array,
 *     producing invalid CSS with 8 arguments. The fix must extract only the 4
 *     control-point values at indices 2–5:
 *     `cubic-bezier(${value[2]},${value[3]},${value[4]},${value[5]})`.
 */
import "@testing-library/jest-dom"
import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BezierCurveEditor } from "../bezier-curve-editor"

describe("BezierCurveEditor bugs", () => {
  describe("BUG 1: Preview animation must use valid 4-value cubic-bezier()", () => {
    it("uses exactly 4 cubic-bezier arguments from control points, not 8 from the expanded array", () => {
      render(
        <BezierCurveEditor
          allowNodeEditing
          value={[0, 0, 0.42, 0, 0.58, 1, 1, 1]}
          enablePreview
        />,
      )

      const preview = document.querySelector('[data-slot="preview"]')
      expect(preview).not.toBeNull()

      const timingFn = (preview as Element).style.animationTimingFunction
      expect(timingFn).toBeTruthy()

      const args = timingFn
        .match(/cubic-bezier\((.+)\)/)?.[1]
        .split(",")
        .map((s) => s.trim())

      expect(args).toHaveLength(4)
      expect(args).toEqual(["0.42", "0", "0.58", "1"])
    })
  })

  /**
   * DISABLED POINTS: disabledPoints=[true,false] hides first handle line
   *   User scenario: Developer renders editor with disabledPoints=[true, false].
   *     The start handle line (interactive drag target) must NOT be rendered.
   *   Regression it prevents: Disabled handle still rendered and interactive
   *   Logic change: bezier-curve-editor-curve.tsx checks `disabledPoints[0] ? null : <line>`.
   *     If this conditional breaks, disabled lines are still draggable.
   */
  describe("disabledPoints hides handle lines", () => {
    it("does not render start handle line when disabledPoints[0] is true", () => {
      render(
        <BezierCurveEditor
          allowNodeEditing
          value={[0, 0, 0.42, 0, 0.58, 1, 1, 1]}
          disabledPoints={[true, false]}
        />,
      )

      const lines = document.querySelectorAll('line[data-slot="line"]')

      lines.forEach((line) => {
        const style = (line as HTMLElement).style
        if (style.pointerEvents === "auto") {
          const x1 = line.getAttribute("x1")
          const y1 = line.getAttribute("y1")
          expect(x1).not.toBe("0")
        }
      })
    })

    it("does not render start handle button when disabledPoints[0] is true", () => {
      render(
        <BezierCurveEditor
          allowNodeEditing
          value={[0, 0, 0.42, 0, 0.58, 1, 1, 1]}
          disabledPoints={[true, false]}
        />,
      )

      const startHandles = document.querySelectorAll('[data-slot="handle"][data-state="start"]')
      expect(startHandles).toHaveLength(0)

      const endHandles = document.querySelectorAll('[data-slot="handle"][data-state="end"]')
      expect(endHandles).toHaveLength(1)
    })
  })

  /**
   * PREVIEW STATE: previewState changes between running/paused/hidden
   *   User scenario: Preview is enabled. When no drag is happening, the preview circle
   *     should have animationPlayState="running".
   *   Regression it prevents: Preview always paused or always hidden
   *   Logic change: previewState is "hidden" when enablePreview is false, "running" when
   *     no drag is happening, "paused" during drag. If the logic breaks, the preview
   *     circle has wrong play state.
   */
  describe("previewState", () => {
    it("hides preview circle when enablePreview is not set", () => {
      render(
        <BezierCurveEditor
          allowNodeEditing
          value={[0, 0, 0.42, 0, 0.58, 1, 1, 1]}
        />,
      )

      const preview = document.querySelector('[data-slot="preview"]')
      expect(preview).toBeNull()
    })

    it("shows running preview when enablePreview is true and no drag is active", () => {
      render(
        <BezierCurveEditor
          allowNodeEditing
          value={[0, 0, 0.42, 0, 0.58, 1, 1, 1]}
          enablePreview
        />,
      )

      const preview = document.querySelector('[data-slot="preview"]')
      expect(preview).not.toBeNull()
      expect((preview as HTMLElement).style.animationPlayState).toBe("running")
    })
  })
})
