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
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Loader } from "../loader"

describe("Loader bugs", () => {
  describe("BUG 8: must not crash with empty stages array", () => {
    it("renders without throwing when stages is an empty array", () => {
      expect(() => {
        render(
          <Loader
            stages={[]}
            description="Loading..."
          />,
        )
      }).not.toThrow()
    })
  })
})
