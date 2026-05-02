/**
 * Loader bug-focused tests
 *
 * BUG 8: Crashes with empty stages array
 *   - User scenario: Developer conditionally builds stages array and passes [].
 *     stages[0] is undefined, accessing .label throws TypeError, crashing the React tree.
 *   - Regression it prevents: Runtime crash from empty stages array
 *   - Logic change that makes it fail: Line 24 `const stage = stages[actualStage]`.
 *     When stages=[], actualStage=0, stage=undefined. Line 191 `{stage.label}` throws.
 *     Fix = add null guard or return early when stages is empty.
 */
import "@testing-library/jest-dom"
import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Loader } from "../loader"

describe("Loader bugs", () => {
  describe("BUG 8: must not crash with empty stages array", () => {
    it("renders without throwing when stages is an empty array", () => {
      expect(() => {
        render(<Loader stages={[]} />)
      }).not.toThrow()
    })
  })

  /**
   * STAGE AUTO-PROGRESSION
   *   User scenario: Loader with 2 stages and duration=1000ms. After 1 second,
   *     the second stage label should appear automatically.
   *   Regression it prevents: Stages never advancing on their own
   *   Logic change: useEffect sets an interval at `duration` ms that increments
   *     currentStage via modulo. If the interval or setCurrentStage logic breaks,
   *     the loader stays on the first stage forever.
   */
  describe("stage auto-progression", () => {
    it("advances to the next stage after the duration elapses", () => {
      vi.useFakeTimers()

      render(
        <Loader
          stages={[
            { label: "Stage 1", icon: <span>1</span> },
            { label: "Stage 2", icon: <span>2</span> },
          ]}
          duration={1000}
        />,
      )

      expect(screen.getByText("Stage 1")).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(screen.getByText("Stage 2")).toBeInTheDocument()

      vi.useRealTimers()
    })
  })

  /**
   * ONSTAGECHANGE CALLBACK
   *   User scenario: Developer provides onStageChange to track which stage is active.
   *     The callback must fire with the new stage index on each transition.
   *   Regression it prevents: onStageChange not being called on stage transitions
   *   Logic change: The interval's setCurrentStage callback calls onStageChange?.(next).
   *     If this call is removed or the index is wrong, consumers can't react to changes.
   */
  describe("onStageChange callback", () => {
    it("calls onStageChange with the new stage index when advancing", () => {
      vi.useFakeTimers()
      const onStageChange = vi.fn()

      render(
        <Loader
          stages={[
            { label: "Loading", icon: <span>L</span> },
            { label: "Processing", icon: <span>P</span> },
          ]}
          duration={500}
          onStageChange={onStageChange}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(onStageChange).toHaveBeenCalledWith(1)

      vi.useRealTimers()
    })
  })

  /**
   * CONTROLLED CURRENTSTAGE
   *   User scenario: Developer controls the stage externally via currentStage prop.
   *     The loader must display the specified stage and NOT auto-advance.
   *   Regression it prevents: Controlled mode being overridden by internal interval
   *   Logic change: useEffect returns early when controlledStage !== undefined.
   *     If this guard is removed, the interval runs and overrides the controlled stage.
   */
  describe("controlled currentStage", () => {
    it("displays the controlled stage and does not auto-advance", () => {
      vi.useFakeTimers()

      render(
        <Loader
          stages={[
            { label: "First", icon: <span>1</span> },
            { label: "Second", icon: <span>2</span> },
          ]}
          duration={500}
          currentStage={1}
        />,
      )

      expect(screen.getByText("Second")).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(screen.getByText("Second")).toBeInTheDocument()

      vi.useRealTimers()
    })
  })
})
