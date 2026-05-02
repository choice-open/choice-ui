/**
 * Color Parser bug-focused tests
 *
 * BUG 5: HSLA comma-separated alpha is silently lost
 *   - User scenario: User types `hsla(120, 50%, 50%, 0.5)` into color input.
 *     The alpha is parsed as 1 (fully opaque) instead of 0.5 (semi-transparent).
 *   - Regression it prevents: Alpha transparency lost for HSLA comma format
 *   - Logic change: use-color-parser.ts:98 - regex `/\/\s*([\d.]+)%?\s*\)$/`
 *     only matches modern "/" separator, never legacy comma syntax.
 *     Fix = also extract alpha from comma-separated 4th value.
 *
 * BUG 6: Modern HSL syntax with "/" alpha fails entirely
 *   - User scenario: User types `hsl(120 50% 50% / 0.5)` (valid CSS) into input.
 *     The color fails to parse and the input reverts to the previous value.
 *   - Regression it prevents: Valid modern CSS HSL syntax rejected
 *   - Logic change: use-color-parser.ts:80-91 - split by `[\s,]+` produces
 *     5 parts ["120","50%","50%","/","0.5"], falls to default branch which
 *     joins them as `hsl(120, 50%, 50%, /, 0.5)` - invalid CSS.
 *     Fix = strip "/ alpha" portion before splitting.
 */
import { describe, expect, it } from "vitest"
import { useColorParser } from "../hooks/use-color-parser"

describe("Color Parser bugs", () => {
  const { parseColor } = useColorParser()

  describe("BUG 5: HSLA comma-separated alpha must be preserved", () => {
    it("parses hsla(120, 50%, 50%, 0.5) with alpha=0.5, not alpha=1", () => {
      const result = parseColor("hsla(120, 50%, 50%, 0.5)")

      expect(result.color).not.toBeNull()
      expect(result.hasAlpha).toBe(true)
      expect(result.alpha).toBe(0.5)
    })

    it("parses hsla(240, 100%, 50%, 0.25) with alpha=0.25", () => {
      const result = parseColor("hsla(240, 100%, 50%, 0.25)")

      expect(result.color).not.toBeNull()
      expect(result.hasAlpha).toBe(true)
      expect(result.alpha).toBeCloseTo(0.25, 1)
    })

    it("parses hsla(120, 50%, 50%, 50%) as alpha=0.5 (percent alpha)", () => {
      // Regression for capture group %? being optional outside the group:
      // alphaStr previously dropped the '%' and divided by 1 instead of 100,
      // yielding alpha=50 for hsla(..., 50%).
      const result = parseColor("hsla(120, 50%, 50%, 50%)")

      expect(result.color).not.toBeNull()
      expect(result.hasAlpha).toBe(true)
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })

    it("parses hsl(0 100% 50% / 25%) as alpha=0.25 (percent alpha, slash form)", () => {
      const result = parseColor("hsl(0 100% 50% / 25%)")

      expect(result.color).not.toBeNull()
      expect(result.hasAlpha).toBe(true)
      expect(result.alpha).toBeCloseTo(0.25, 2)
    })
  })

  describe("BUG 6: Modern HSL syntax with / alpha must parse correctly", () => {
    it("parses hsl(120 50% 50% / 0.5) without error", () => {
      const result = parseColor("hsl(120 50% 50% / 0.5)")

      expect(result.color).not.toBeNull()
      expect(result.hasAlpha).toBe(true)
      expect(result.alpha).toBe(0.5)
    })

    it("parses hsl(0 100% 50%) without alpha", () => {
      const result = parseColor("hsl(0 100% 50%)")

      expect(result.color).not.toBeNull()
      expect(result.alpha).toBe(1)
    })
  })
})
