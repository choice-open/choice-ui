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
  const ops: Operation[] = []
  const nums: number[] = []
  let num = ""

  const precedenceOf = (op: Operation): number => precedence[op]

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i]
    if (char === " ") continue

    if ((char >= "0" && char <= "9") || char === "." || (char === "-" && i === 0)) {
      num += char
    } else {
      if (num) {
        nums.push(parseFloat(num))
        num = ""
      }

      if (char === "(") {
        ops.push(char)
      } else if (char === ")") {
        while (ops.length && ops[ops.length - 1] !== "(") {
          const op = ops.pop()!
          const b = nums.pop()!
          const a = nums.pop()!
          nums.push(applyOperation(op, b, a))
        }
        ops.pop() // Remove "("
      } else {
        while (ops.length && precedenceOf(ops[ops.length - 1]) >= precedenceOf(char as Operation)) {
          const op = ops.pop()!
          const b = nums.pop()!
          const a = nums.pop()!
          nums.push(applyOperation(op, b, a))
        }
        ops.push(char as Operation)
      }
    }
  }

  if (num) {
    nums.push(parseFloat(num))
  }

  while (ops.length) {
    const op = ops.pop()!
    const b = nums.pop()!
    const a = nums.pop()!
    nums.push(applyOperation(op, b, a))
  }

  const result = nums.pop()
  if (result === undefined) {
    throw new Error(`Invalid expression: ${expression}`)
  }
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
