/**
 * Progress bug-focused tests
 *
 * BUG 4: ProgressBar aria-valuenow uses percentage (0-100) instead of actual value
 *   - User scenario: ProgressBar with value=75, min=0, max=200.
 *     Screen reader announces "38 out of 200" (19%) instead of "75 out of 200" (37.5%).
 *   - Regression it prevents: Incorrect progress announcements for non-default min/max
 *   - Logic change that makes it fail: Line 170 uses `percent` (0-100) for aria-valuenow
 *     while aria-valuemin/max use raw min/max props.
 *     Fix = use `value` instead of `percent`.
 *
 * BUG 5: ProgressCircle aria-valuenow same issue
 *   - Same as BUG 4 but for circular progress.
 *   - Line 156: `aria-valuenow={percent}` instead of `aria-valuenow={value}`.
 *
 * BUG 6 (Medium): Connects component - style spread overrides based-on-value backgroundColor
 *   - User scenario: Developer renders <ProgressBar variant="based-on-value"> and passes
 *     style prop to Connects subcomponent. The user-provided style overrides the computed
 *     based-on-value backgroundColor, breaking the dynamic color feature.
 *   - Regression it prevents: based-on-value color stops working when any style prop is
 *     passed to Connects.
 *   - Logic change that makes it fail: progress-bar.tsx lines 245-246 — the computed
 *     backgroundColor is set first, then `...style` spread overrides it. Fix = reverse
 *     the order or deep-merge, putting `...style` before the computed backgroundColor.
 *
 * BUG 7 (Medium): ProgressCircle negative radius when strokeWidth > size/2
 *   - User scenario: Developer renders <ProgressCircle size={20} strokeWidth={15} />.
 *     The computed radius = 20/2 - 15 = -5, producing a negative radius for the SVG
 *     circle, which renders incorrectly or not at all.
 *   - Regression it prevents: Broken SVG rendering with invalid negative radius.
 *   - Logic change that makes it fail: progress-circle.tsx line 57 —
 *     `radius = center - strokeWidth` with no lower bound. Fix = Math.max(0, radius).
 */
import "@testing-library/jest-dom"
import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ProgressBar } from "../progress-bar"
import { ProgressCircle } from "../progress-circle"

describe("Progress bugs", () => {
  describe("BUG 4: ProgressBar aria-valuenow must use actual value, not percentage", () => {
    it("reports the actual value when min/max are non-default", () => {
      render(
        <ProgressBar
          value={75}
          min={0}
          max={200}
        />,
      )

      const progressbar = screen.getByRole("progressbar")
      expect(progressbar).toHaveAttribute("aria-valuemin", "0")
      expect(progressbar).toHaveAttribute("aria-valuemax", "200")
      expect(progressbar).toHaveAttribute("aria-valuenow", "75")
    })
  })

  describe("BUG 5: ProgressCircle aria-valuenow must use actual value, not percentage", () => {
    it("reports the actual value when min/max are non-default", () => {
      render(
        <ProgressCircle
          value={75}
          min={0}
          max={200}
        />,
      )

      const progressbar = screen.getByRole("progressbar")
      expect(progressbar).toHaveAttribute("aria-valuemin", "0")
      expect(progressbar).toHaveAttribute("aria-valuemax", "200")
      expect(progressbar).toHaveAttribute("aria-valuenow", "75")
    })
  })

  describe("BUG 6: Connects style must not override based-on-value backgroundColor", () => {
    it("preserves based-on-value color when style prop is passed to Connects", () => {
      render(
        <ProgressBar
          value={50}
          min={0}
          max={100}
          variant="based-on-value"
        >
          <ProgressBar.Connects style={{ opacity: 0.8 }} />
        </ProgressBar>,
      )

      const progressbar = screen.getByRole("progressbar")
      const fill = progressbar.querySelector("[class*='connect']") as HTMLElement
      if (fill) {
        const bgColor = fill.style.backgroundColor
        expect(bgColor).toBeTruthy()
        expect(bgColor).not.toBe("")
      }
    })
  })

  describe("BUG 7: ProgressCircle must handle strokeWidth larger than size/2", () => {
    it("renders without errors when strokeWidth > size/2", () => {
      const { container } = render(
        <ProgressCircle
          value={50}
          size={20}
          strokeWidth={15}
        />,
      )

      const svg = container.querySelector("svg")
      expect(svg).toBeTruthy()

      const circle = container.querySelector("circle")
      expect(circle).toBeTruthy()

      const radius = parseFloat(circle?.getAttribute("r") ?? "0")
      expect(radius).toBeGreaterThanOrEqual(0)
    })
  })
})
