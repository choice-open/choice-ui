import { NumericInputValue } from "../types"
import { evaluate } from "./expression-evaluator"

/**
 * Parse input value, support string, number, array and object types
 * @param input Input value
 * @returns Parsed number array
 */
export function parseInputValue(input: NumericInputValue): {
  values: number[]
  isInputNumber: boolean
  isObjectNumber: boolean
} {
  let values: number[] = []
  let isInputNumber = false
  let isObjectNumber = false

  try {
    if (typeof input === "string" || typeof input === "number") {
      // String or number input processing
      values = String(input)
        .split(",")
        .map((char) => evaluate(char))
      isInputNumber = values.length > 0
    } else if (Array.isArray(input)) {
      // Array input processing
      values = input.map((item) => evaluate(String(item)))
      isInputNumber = values.length > 0
    } else if (typeof input === "object" && input !== null) {
      // Object input processing
      isObjectNumber = true
    }
  } catch (_error) {
    // Return empty array when parsing error occurs
  }

  return { values, isInputNumber, isObjectNumber }
}

/**
 * Extract variable values from input string
 * @param input Input string
 * @param regex Matching regular expression
 * @param keys Variable key array
 * @returns Extracted variable values
 */
export function extractValuesFromString(
  input: string,
  regex: RegExp,
  keys: string[],
): Record<string, number> | null {
  const match = input.match(regex)
  if (!match) return null

  const result: Record<string, number> = {}
  keys.forEach((key, index) => {
    try {
      const value = evaluate(match[index + 1] ?? match[1])
      result[key] = value
    } catch (error) {
      result[key] = 0
    }
  })

  return result
}
