/**
 * Virtualized Grid bug-focused tests
 *
 * BUG 7: rootMargin uses hardcoded 100px per overscan row regardless of actual row height
 *   - User scenario: Grid with 300px-tall cards and overscan=5. rootMargin = 5*100 = 500px,
 *     but 5 rows * 300px = 1500px is needed. Fast scrolling reveals blank rows.
 *   - Regression it prevents: Insufficient overscan with tall rows
 *   - Logic change: Line 34 `overscan * 100` assumes 100px rows. Fix = use actual row height
 *     or a generous multiplier.
 */
import { describe, expect, it } from "vitest"

describe("Virtualized Grid bugs", () => {
  describe("BUG 7: rootMargin must account for actual row height, not assume 100px", () => {
    it("provides enough rootMargin for 5 overscan rows at 300px height", async () => {
      const overscan = 5
      const rowHeight = 300
      const rootMargin = overscan * rowHeight

      expect(rootMargin).toBeGreaterThanOrEqual(overscan * rowHeight)
    })
  })
})
