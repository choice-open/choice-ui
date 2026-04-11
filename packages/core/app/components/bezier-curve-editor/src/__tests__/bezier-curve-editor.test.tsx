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
import { render } from "@testing-library/react"
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

      // The expanded value is [0, 0, 0.42, 0, 0.58, 1, 1, 1].
      // Control points are at indices [2..5]: 0.42, 0, 0.58, 1.
      // cubic-bezier() CSS requires exactly 4 arguments.
      //
      // Buggy code produces: cubic-bezier(0,0,0.42,0,0.58,1,1,1) — 8 args, invalid
      // Fixed code produces:  cubic-bezier(0.42,0,0.58,1)         — 4 args, valid
      const args = timingFn
        .match(/cubic-bezier\((.+)\)/)?.[1]
        .split(",")
        .map((s) => s.trim())

      expect(args).toHaveLength(4)
      expect(args).toEqual(["0.42", "0", "0.58", "1"])
    })
  })
})
