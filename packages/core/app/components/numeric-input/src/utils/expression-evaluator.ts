import { Operation } from "../types"

/**
 * Operator precedence mapping
 */
const precedence: Record<Operation, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "(": 0,
  ")": 0,
}

/**
 * Execute binary operation
 * @param op 操作符
 * @param b Right operand
 * @param a Left operand
 * @returns Calculation result
 */
export const applyOperation = (op: Operation, b: number, a: number): number => {
  switch (op) {
    case "+":
      return a + b
    case "-":
      return a - b
    case "*":
      return a * b
    case "/":
      return a / b
    default:
      throw new Error(`Invalid operation: ${op}`)
  }
}

/**
 * Evaluate mathematical expression and return calculation result
 * @param expression Mathematical expression string
 * @returns Calculation result of the expression
 */
export const evaluate = (expression: string): number => {
  const trimmed = expression.trim()
  if (!trimmed) return NaN

  const ops: Operation[] = []
  const nums: number[] = []
  let num = ""

  const precedenceOf = (op: Operation): number => precedence[op]

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i]
    if (char === " ") continue

    const isDigitOrDot = (char >= "0" && char <= "9") || char === "."
    const isNegativeSign =
      char === "-" &&
      (i === 0 ||
        trimmed.substring(0, i).trimEnd().endsWith("(") ||
        "+-*/".includes(trimmed.substring(0, i).trimEnd().slice(-1)))
    if (isDigitOrDot || isNegativeSign) {
      num += char
    } else {
      if (num) {
        nums.push(parseFloat(num))
        num = ""
      }

      if (char === "(") {
        ops.push(char)
      } else if (char === ")") {
        if (!ops.includes("(")) return NaN
        while (ops.length && ops[ops.length - 1] !== "(") {
          const op = ops.pop()!
          const b = nums.pop()
          const a = nums.pop()
          if (a === undefined || b === undefined) return NaN
          nums.push(applyOperation(op, b, a))
        }
        ops.pop()
      } else if ("+-*/".includes(char)) {
        while (ops.length && precedenceOf(ops[ops.length - 1]) >= precedenceOf(char as Operation)) {
          const op = ops.pop()!
          const b = nums.pop()
          const a = nums.pop()
          if (a === undefined || b === undefined) return NaN
          nums.push(applyOperation(op, b, a))
        }
        ops.push(char as Operation)
      } else {
        return NaN
      }
    }
  }

  if (num) {
    const parsed = parseFloat(num)
    if (isNaN(parsed)) return NaN
    nums.push(parsed)
  }

  while (ops.length) {
    if (ops[ops.length - 1] === "(") return NaN
    const op = ops.pop()!
    const b = nums.pop()
    const a = nums.pop()
    if (a === undefined || b === undefined) return NaN
    nums.push(applyOperation(op, b, a))
  }

  const result = nums.pop()
  if (result === undefined) return NaN
  return result
}

/**
 * Memoized wrapper function, used to cache expression calculation results
 * @param fn Original function
 * @returns Function with caching functionality
 */
export function memoize<T extends string, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>()
  return (arg: T) => {
    if (cache.has(arg)) return cache.get(arg)!
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

/**
 * Memoized expression calculation function
 */
export const memoizedEvaluate = memoize<string, number>(evaluate)
