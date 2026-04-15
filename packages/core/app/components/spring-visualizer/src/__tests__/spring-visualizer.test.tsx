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
import { render, screen, waitFor } from "@testing-library/react"
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

  /**
   * MODE SWITCH: physics vs time
   *   User scenario: Developer switches mode from "physics" (default) to "time".
   *     The SVG path must change because the math formula is different.
   *   Regression it prevents: mode prop having no effect on the rendered curve
   *   Logic change: mode determines whether generatePhysicsSpringPath or
   *     generateTimeSpringPath is called. If mode branching breaks, both modes
   *     render the same path.
   */
  describe("mode renders different paths", () => {
    it("renders different SVG paths for physics and time modes", () => {
      const { container: physicsContainer } = render(
        <SpringVisualizer
          mode="physics"
          stiffness={100}
          damping={30}
          mass={1}
        />,
      )

      const { container: timeContainer } = render(
        <SpringVisualizer
          mode="time"
          duration={0.8}
          bounce={0.3}
        />,
      )

      const physicsPath = physicsContainer.querySelector("path")?.getAttribute("d")
      const timePath = timeContainer.querySelector("path")?.getAttribute("d")

      expect(physicsPath).toBeTruthy()
      expect(timePath).toBeTruthy()
      expect(physicsPath).not.toBe(timePath)
    })
  })

  /**
   * DELAY PROP
   *   User scenario: Developer sets delay=2. The path should be empty initially
   *     and appear after the delay timeout fires.
   *   Regression it prevents: delay prop being ignored, path rendered immediately
   *   Logic change: When delay > 0, path starts empty and setTimeout sets it after
   *     delay * 1000ms. If the useEffect delay logic breaks, path renders immediately.
   */
  describe("delay defers path rendering", () => {
    it("renders an empty path initially when delay > 0", () => {
      const { container } = render(
        <SpringVisualizer
          delay={5}
          mode="physics"
        />,
      )

      const path = container.querySelector("path")
      expect(path?.getAttribute("d")).toBe("")
    })

    it("renders the path immediately when delay is 0", () => {
      const { container } = render(
        <SpringVisualizer
          delay={0}
          mode="physics"
        />,
      )

      const path = container.querySelector("path")
      expect(path?.getAttribute("d")?.length).toBeGreaterThan(0)
    })
  })
})
