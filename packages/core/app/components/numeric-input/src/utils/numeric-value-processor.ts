import { DealWithNumericValueOptions, NumberResult } from "../types"
import { extractValuesFromString, parseInputValue } from "./input-parser"
import { formatResult, parsePattern } from "./pattern-parser"
import { applyConstraintsToValues, applyTransform } from "./value-processor"

/**
 * Safe handling of numeric input, capture exceptions and return undefined
 * @param options Input options
 * @returns Processing result or undefined (when error occurs)
 */
export const dealWithNumericValueCatch = (
  options: DealWithNumericValueOptions,
): NumberResult | undefined => {
  try {
    return dealWithNumericInputValue(options)
  } catch (_error) {
    return undefined
  }
}

/**
 * Main processing function: process various types of numeric input and apply constraints
 * @param options Input options
 * @returns Processing result object
 */
export const dealWithNumericInputValue = ({
  input,
  pattern,
  call,
  max = Infinity,
  min = -Infinity,
  decimal = 2,
}: DealWithNumericValueOptions): NumberResult => {
  // 1. Parse pattern
  const { keys, regex } = parsePattern(pattern)

  // 2. Parse input value
  const { values, isInputNumber, isObjectNumber } = parseInputValue(input)

  // 3. Get result object based on input type
  const result: Record<string, number> = {}

  if (typeof input === "string" && input.match(regex) && !isInputNumber && !isObjectNumber) {
    // Process string input that matches the pattern
    const extractedValues = extractValuesFromString(input, regex, keys)
    if (extractedValues) {
      Object.assign(result, extractedValues)
    }
  } else if (isInputNumber) {
    // Process number or number array input
    keys.forEach((key, index) => {
      result[key] = values[index] ?? values[0]
    })
  } else if (isObjectNumber) {
    // Process object input
    const objInput = input as Record<string, number>

    // First, keep all existing properties in the object
    Object.keys(objInput).forEach((key) => {
      if (typeof objInput[key] === "number") {
        result[key] = objInput[key]
      }
    })

    // Then ensure that all keys defined in the expression exist
    keys.forEach((key) => {
      // Only set default value 0 when result[key] is undefined
      if (result[key] === undefined) {
        result[key] = 0
      }
    })
  } else {
    throw new Error(`Invalid input: ${input}`)
  }

  // 4. Apply transformation function (if any)
  if (call) {
    applyTransform(result, call)
  }

  // 5. Apply constraints (minimum value, maximum value, decimal places)
  applyConstraintsToValues(result, min, max, decimal)

  // 6. Format output string
  const resStr = formatResult(pattern, result)

  // 7. Return result object
  return {
    array: Object.values(result),
    string: resStr,
    object: result,
  }
}
