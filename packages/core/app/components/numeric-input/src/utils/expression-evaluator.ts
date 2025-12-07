import { Operation } from "../types"

/**
 * 运算符优先级映射
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
 * 执行二元操作
 * @param op 操作符
 * @param b 右操作数
 * @param a 左操作数
 * @returns 计算结果
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
 * 评估数学表达式并返回计算结果
 * @param expression 数学表达式字符串
 * @returns 表达式的计算结果
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
 * 记忆化包装函数，用于缓存表达式计算结果
 * @param fn 原始函数
 * @returns 具有缓存功能的函数
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
 * 记忆化的表达式计算函数
 */
export const memoizedEvaluate = memoize<string, number>(evaluate)
