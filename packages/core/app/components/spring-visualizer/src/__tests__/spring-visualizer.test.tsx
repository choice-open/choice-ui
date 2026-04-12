/**
 * SpringVisualizer bug-focused tests
 *
 * BUG 1: Hardcoded SVG gradient ID causes visual conflicts with multiple instances
 *   - User scenario: Developer renders two SpringVisualizer components with different
 *     startColor/endColor. Both use the same gradient ID "springGradient". All instances
 *     render with the first instance's colors because SVG gradient IDs are document-global.
 *   - Regression it prevents: Multiple spring visualizers showing wrong colors
 *   - Logic change: spring-visualizer.tsx line 86 uses hardcoded `id="springGradient"`.
 *     Line 28 references it as `stroke-[url(#springGradient)]`. When multiple instances
 *     exist, all reference the first gradient definition. Fix = use React.useId() to
 *     generate a unique gradient ID per instance.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpringVisualizer } from "../spring-visualizer"

describe("SpringVisualizer bugs", () => {
  describe("BUG 1: multiple instances must not share gradient ID", () => {
    it("renders unique gradient IDs for each instance", () => {
      const { container } = render(
        <>
          <SpringVisualizer
            startColor="#ff0000"
            endColor="#00ff00"
          />
          <SpringVisualizer
            startColor="#0000ff"
            endColor="#ffff00"
          />
        </>,
      )

      const gradients = container.querySelectorAll("linearGradient")
      const ids = Array.from(gradients).map((g) => g.getAttribute("id"))

      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })
})
