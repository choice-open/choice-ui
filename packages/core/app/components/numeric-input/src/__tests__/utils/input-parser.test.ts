import { afterEach, describe, expect, it, vi } from "vitest"
import { parseInputValue } from "../../utils/input-parser"
import { dealWithNumericInputValue } from "../../utils/numeric-value-processor"

describe("input-parser", () => {
  afterEach(() => {
    vi.doUnmock("../../utils/expression-evaluator")
    vi.resetModules()
  })

  describe("parseInputValue", () => {
    it("does not treat formatted percent input as numeric input", () => {
      const result = parseInputValue("75%")

      expect(result.isInputNumber).toBe(false)
      expect(result.isObjectNumber).toBe(false)
    })

    it("does not treat arrays containing NaN evaluation results as numeric input", async () => {
      vi.doMock("../../utils/expression-evaluator", () => ({
        evaluate: () => Number.NaN,
      }))

      const { parseInputValue } = await import("../../utils/input-parser")
      const result = parseInputValue(["75%"])

      expect(result.values).toHaveLength(1)
      expect(result.values[0]).toBeNaN()
      expect(result.isInputNumber).toBe(false)
      expect(result.isObjectNumber).toBe(false)
    })

    it("does not treat strings with NaN evaluation results as numeric input", async () => {
      vi.doMock("../../utils/expression-evaluator", () => ({
        evaluate: () => Number.NaN,
      }))

      const { parseInputValue } = await import("../../utils/input-parser")
      const result = parseInputValue("75%")

      expect(result.values).toHaveLength(1)
      expect(result.values[0]).toBeNaN()
      expect(result.isInputNumber).toBe(false)
      expect(result.isObjectNumber).toBe(false)
    })

    it("keeps valid numeric arrays as numeric input", () => {
      const result = parseInputValue([75])

      expect(result.values).toEqual([75])
      expect(result.isInputNumber).toBe(true)
      expect(result.isObjectNumber).toBe(false)
    })
  })

  describe("dealWithNumericInputValue", () => {
    it("parses formatted percent input through the expression pattern", () => {
      const result = dealWithNumericInputValue({
        input: "75%",
        pattern: "{value}%",
      })

      expect(result.object).toEqual({ value: 75 })
      expect(result.array).toEqual([75])
      expect(result.string).toBe("75%")
    })
  })
})
