import { NumericInputValue } from "../types"
import { evaluate } from "./expression-evaluator"

/**
 * 解析输入值，支持字符串、数字、数组和对象类型
 * @param input 输入值
 * @returns 解析后的数字数组
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
      // 字符串或数字输入处理
      values = String(input)
        .split(",")
        .map((char) => evaluate(char))
      isInputNumber = values.length > 0
    } else if (Array.isArray(input)) {
      // 数组输入处理
      values = input.map((item) => evaluate(String(item)))
      isInputNumber = values.length > 0
    } else if (typeof input === "object" && input !== null) {
      // 对象输入处理
      isObjectNumber = true
    }
  } catch (_error) {
    // 解析错误时返回空数组
  }

  return { values, isInputNumber, isObjectNumber }
}

/**
 * 从输入字符串中提取变量值
 * @param input 输入字符串
 * @param regex 匹配正则表达式
 * @param keys 变量键数组
 * @returns 提取的变量值
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
