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
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
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
})
