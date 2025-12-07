import { evaluate } from "../../utils/expression-evaluator"

describe("expression-evaluator", () => {
  describe("evaluate", () => {
    // Basic arithmetic
    it("evaluates basic addition", () => {
      expect(evaluate("1 + 2")).toBe(3)
    })

    it("evaluates basic subtraction", () => {
      expect(evaluate("5 - 3")).toBe(2)
    })

    it("evaluates basic multiplication", () => {
      expect(evaluate("4 * 3")).toBe(12)
    })

    it("evaluates basic division", () => {
      expect(evaluate("10 / 2")).toBe(5)
    })

    // Operator precedence
    it("respects operator precedence", () => {
      expect(evaluate("1 + 2 * 3")).toBe(7) // multiplication before addition
      expect(evaluate("10 / 2 + 3")).toBe(8) // division before addition
      expect(evaluate("2 + 3 * 4 - 5")).toBe(9) // complex expression
    })

    // Parentheses
    it("handles parentheses correctly", () => {
      expect(evaluate("(1 + 2) * 3")).toBe(9)
      expect(evaluate("2 * (3 + 4)")).toBe(14)
      expect(evaluate("(10 / (2 + 3))")).toBe(2)
      expect(evaluate("((1 + 2) * (3 + 4))")).toBe(21)
    })

    // Nested expressions
    it("evaluates nested expressions", () => {
      expect(evaluate("1 + (2 * (3 + 4) - 5)")).toBe(10)
      expect(evaluate("(10 / (5 - 3)) * 2")).toBe(10)
    })

    // Decimal numbers
    it("handles decimal numbers", () => {
      expect(evaluate("1.5 + 2.5")).toBe(4)
      expect(evaluate("3.33 * 3")).toBeCloseTo(9.99)
      expect(evaluate("10 / 3")).toBeCloseTo(3.333, 3)
    })

    // Negative numbers
    it("handles negative numbers", () => {
      expect(evaluate("-5 + 10")).toBe(5)
      expect(evaluate("10 - -5")).toBe(15)
      expect(evaluate("-5 * -3")).toBe(15)
    })

    // Whitespace handling
    it("ignores whitespace", () => {
      expect(evaluate("1+2")).toBe(3)
      expect(evaluate("  1  +  2  ")).toBe(3)
      expect(evaluate("1 + 2")).toBe(3)
    })

    // Error handling
    it("returns NaN for invalid expressions", () => {
      expect(evaluate("1 +")).toBeNaN()
      expect(evaluate("* 5")).toBeNaN()
      expect(evaluate("1 + * 5")).toBeNaN()
      expect(evaluate("5 /")).toBeNaN()
    })

    it("returns NaN for unbalanced parentheses", () => {
      expect(evaluate("(1 + 2")).toBeNaN()
      expect(evaluate("1 + 2)")).toBeNaN()
      expect(evaluate("((1 + 2)")).toBeNaN()
    })

    it("handles division by zero", () => {
      expect(evaluate("10 / 0")).toBe(Infinity)
    })

    // Non-numeric input
    it("returns NaN for non-numeric input", () => {
      expect(evaluate("abc")).toBeNaN()
      expect(evaluate("1 + a")).toBeNaN()
    })

    // Edge cases
    it("handles empty expression", () => {
      expect(evaluate("")).toBeNaN()
    })

    it("handles single number expressions", () => {
      expect(evaluate("42")).toBe(42)
      expect(evaluate("-42")).toBe(-42)
      expect(evaluate("3.14")).toBe(3.14)
    })
  })
})
